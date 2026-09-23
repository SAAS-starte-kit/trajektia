const fs = require('fs');

const pdfText = `
200.B1
200.D1
200.Z1
200.C1
300.A1
300.B1
300.C1
300.D1
300.Z0
500.A1
500.B1
500.C1
500.Z0
501.A0
506.A0
510.A0
700.A1
700.B0
700.Z0
384.A0
410.F0
410.G0
420.B0
145.D0
152.B0
153.A0
153.C0
153.D0
153.F0
155.A0
231.A0
231.B0
154.A0
414.A0
414.B0
430.A0
430.B0
551.A0
551.B0
561.B0
561.C0
561.D0
561.F0
570.C0
570.D0
570.E0
570.F0
573.A0
233.B0
210.A0
210.D0
260.A0
260.B0
221.A0
221.B0
221.C0
221.D0
230.B0
311.A0
145.B0
145.C0
147.A0
222.A0
243.D0
243.F0
243.G0
243.H0
244.A0
280.D0
248.D0
280.C0
235.B0
235.C0
241.A0
241.B0
241.C0
248.A0
280.B0
190.A0
190.B0
393.B0
570.G0
570.B0
574.A0
574.C0
581.D0
581.C0
582.A1
589.B0
589.C0
241.D0
271.A0
270.A0
248.B0
280.A0
280.F0
410.A1
571.A0
571.B0
571.C0
110.A0
110.B0
111.B0
112.A0
120.A0
140.A0
140.C0
141.A0
142.H0
142.D0
142.F0
142.G0
144.A1
144.F0
160.A0
160.B0
165.A0
171.A0
180.A0
180.B0
181.A1
411.A0
310.A0
310.B1
310.C0
322.A1
351.A1
388.A1
391.A0
`;

const pdfCodes = pdfText.match(/[0-9]{3}\.[A-Z0-9]{2}/g) || [];
console.log("PDF codes count:", pdfCodes.length);

const currentFile = fs.readFileSync('src/data/programmes-dec-prealables.ts', 'utf8');
const currentCodes = currentFile.match(/[0-9]{3}\.[A-Z0-9]{2}/g) || [];

const pdfSet = new Set(pdfCodes);
const currentSet = new Set(currentCodes);

const missingInCurrent = [...pdfSet].filter(x => !currentSet.has(x));
const extraInCurrent = [...currentSet].filter(x => !pdfSet.has(x));

console.log("Missing in current:", missingInCurrent);
console.log("Extra in current:", extraInCurrent);

