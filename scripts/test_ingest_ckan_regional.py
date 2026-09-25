import unittest
import io
import json
import csv
from scripts.ingest_ckan_regional_profiles import (
    decode_ckan_bytes,
    parse_and_aggregate_ckan_data
)

class TestIngestCkanRegional(unittest.TestCase):
    def test_decode_utf16le_with_bom(self):
        # Create bytes with utf-16-le bom + some accented characters like "Montréal"
        bom = b'\xff\xfe'
        text = "Montréal\tQuébec\tTrois-Rivières"
        encoded_text = text.encode('utf-16le')
        raw_bytes = bom + encoded_text
        
        decoded = decode_ckan_bytes(raw_bytes)
        self.assertEqual(decoded, "Montréal\tQuébec\tTrois-Rivières")
        
    def test_decode_utf8(self):
        text = "Montréal\tQuébec\tTrois-Rivières"
        raw_bytes = text.encode('utf-8')
        
        decoded = decode_ckan_bytes(raw_bytes)
        self.assertEqual(decoded, "Montréal\tQuébec\tTrois-Rivières")
        
    def test_salary_annualization(self):
        # Create a mock TSV with various salary periods
        headers = ["Code CNP 2021", "Province/Territory", "Ville", "Région économique", "Salaire par", "Salaire Minimum", "Salaire Maximum", "Virtual work"]
        rows = [
            ["1111", "QC", "Montreal", "Montreal", "Heure", "20.0", "30.0", "non"],  # avg 25.0 * 1820 = 45500
            ["2222", "Québec", "Laval", "Montreal", "Semaine", "1000.0", "1000.0", "oui"], # avg 1000 * 52 = 52000
            ["3333", "Quebec", "Gatineau", "Outaouais", "Mois", "4000.0", "5000.0", "yes"], # avg 4500 * 12 = 54000
            ["4444", "QC", "Levis", "Quebec", "Jour", "200.0", "200.0", "false"], # avg 200 * 260 = 52000
            ["5555", "QC", "Sherbrooke", "Estrie", "Année", "50000.0", "60000.0", "0"], # avg 55000
            ["6666", "QC", "Quebec", "Quebec", "Heure", "5.0", "5.0", "non"], # 5 * 1820 = 9100. Filtered out (< 18000)
            ["7777", "QC", "Quebec", "Quebec", "Heure", "200.0", "200.0", "non"], # 200 * 1820 = 364000. Filtered out (> 350000)
        ]
        
        output = io.StringIO()
        writer = csv.writer(output, delimiter='\t')
        writer.writerow(headers)
        writer.writerows(rows)
        tsv_content = output.getvalue()
        
        results = parse_and_aggregate_ckan_data(tsv_content, '2023-01-01')
        
        # CNP 1111 -> 11110
        self.assertEqual(results[('11110', 'QC', 'Montreal', 'Montreal', '2023-01-01')]['median_salary'], 45500.0)
        self.assertEqual(results[('22220', 'Québec', 'Montreal', 'Laval', '2023-01-01')]['median_salary'], 52000.0)
        self.assertEqual(results[('33330', 'Quebec', 'Outaouais', 'Gatineau', '2023-01-01')]['median_salary'], 54000.0)
        self.assertEqual(results[('44440', 'QC', 'Quebec', 'Levis', '2023-01-01')]['median_salary'], 52000.0)
        self.assertEqual(results[('55550', 'QC', 'Estrie', 'Sherbrooke', '2023-01-01')]['median_salary'], 55000.0)
        
        # Check filtered out salaries (should be None or not present, but we need to check if the group exists)
        self.assertEqual(results[('66660', 'QC', 'Quebec', 'Quebec', '2023-01-01')]['median_salary'], None)
        self.assertEqual(results[('77770', 'QC', 'Quebec', 'Quebec', '2023-01-01')]['median_salary'], None)
        
    def test_quebec_filtering_and_aggregation(self):
        headers = ["Code CNP 2021", "Province/Territory", "Ville", "Région économique", "Salaire par", "Salaire Minimum", "Salaire Maximum", "Virtual work"]
        rows = [
            ["1111", "QC", "Montreal", "Montreal", "Annuel", "50000", "50000", "oui"],
            ["1111", "QC", "Montreal", "Montreal", "Annuel", "60000", "60000", "non"],
            ["1111", "ON", "Toronto", "Toronto", "Annuel", "55000", "55000", "non"], # Should be filtered out
            ["22222", "QC", "Laval", "Laval", "Annuel", "70000", "80000", "yes"],
            ["22222", "QC", "Laval", "Laval", "Annuel", "80000", "90000", "yes"],
        ]
        
        output = io.StringIO()
        writer = csv.writer(output, delimiter='\t')
        writer.writerow(headers)
        writer.writerows(rows)
        tsv_content = output.getvalue()
        
        results = parse_and_aggregate_ckan_data(tsv_content, '2023-01-01')
        
        # Should not have ON
        for key in results:
            self.assertNotEqual(key[1], 'ON')
            
        # Group 1111 -> 11110
        group_1 = results[('11110', 'QC', 'Montreal', 'Montreal', '2023-01-01')]
        self.assertEqual(group_1['postings_count'], 2)
        self.assertEqual(group_1['remote_count'], 1)
        self.assertEqual(group_1['remote_ratio_pct'], 50.0)
        self.assertEqual(group_1['min_salary'], 50000.0)
        self.assertEqual(group_1['max_salary'], 60000.0)
        self.assertEqual(group_1['median_salary'], 55000.0)

        # Group 22222
        group_2 = results[('22222', 'QC', 'Laval', 'Laval', '2023-01-01')]
        self.assertEqual(group_2['postings_count'], 2)
        self.assertEqual(group_2['remote_count'], 2)
        self.assertEqual(group_2['remote_ratio_pct'], 100.0)
        # 75000 and 85000
        self.assertEqual(group_2['min_salary'], 75000.0)
        self.assertEqual(group_2['max_salary'], 85000.0)
        self.assertEqual(group_2['median_salary'], 80000.0)

if __name__ == '__main__':
    unittest.main()
