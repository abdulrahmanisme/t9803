import { CSVAgency } from '../types';

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = '';
  let insideQuotes = false;

  // Remove BOM if present
  const cleanLine = line.replace(/^\uFEFF/, '');

  for (let i = 0; i < cleanLine.length; i++) {
    const char = cleanLine[i];

    if (char === '"') {
      if (insideQuotes && cleanLine[i + 1] === '"') {
        // Handle escaped quotes
        currentValue += '"';
        i++;
      } else {
        // Toggle quotes state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // End of field
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }

  // Add the last field
  values.push(currentValue.trim());

  // Remove surrounding quotes from values
  return values.map((value) => value.replace(/^"(.*)"$/, '$1'));
}

export function parseCSV(content: string): CSVAgency[] {
  try {
    // Split into lines and remove empty lines and BOM
    const lines = content
      .replace(/^\uFEFF/, '')
      .split(/\r?\n/)
      .filter((line) => line.trim());

    if (lines.length < 2) {
      throw new Error(
        'CSV file must contain a header row and at least one data row'
      );
    }

    // Parse headers
    const headers = parseCSVLine(lines[0]).map((header) =>
      header.toLowerCase().trim()
    );
    const requiredHeaders = [
      'name',
      'location',
      'description',
      'contact_email',
    ];

    // Validate headers
    for (const required of requiredHeaders) {
      if (!headers.includes(required)) {
        throw new Error(`Missing required column: ${required}`);
      }
    }

    const agencies: CSVAgency[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      try {
        const values = parseCSVLine(line);

        // Validate row length
        if (values.length !== headers.length) {
          throw new Error(
            `Row ${i + 1} has ${values.length} columns but should have ${
              headers.length
            }`
          );
        }

        const agency: Partial<CSVAgency> = {};

        headers.forEach((header, colIndex) => {
          const value = values[colIndex];

          // Validate required fields
          if (requiredHeaders.includes(header) && !value) {
            throw new Error(
              `Missing required value for ${header} in row ${i + 1}`
            );
          }

          switch (header) {
            case 'trust_score':
              const score = parseFloat(value);
              if (value && (isNaN(score) || score < 0 || score > 100)) {
                throw new Error(
                  `Trust score must be between 0 and 100 in row ${i + 1}`
                );
              }
              agency[header] = score || 0;
              break;
            case 'price':
              const price = parseFloat(value);
              if (value && (isNaN(price) || price < 0)) {
                throw new Error(
                  `Price must be a positive number in row ${i + 1}`
                );
              }
              agency[header] = price || 0;
              break;
            default:
              agency[header as keyof CSVAgency] = value;
          }
        });

        agencies.push(agency as CSVAgency);
      } catch (error) {
        throw new Error(
          `Error in row ${i + 1}: ${
            error instanceof Error ? error.message : 'Invalid data'
          }`
        );
      }
    }

    return agencies;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('Failed to parse CSV file');
  }
}
