export const insertBathroom = `
INSERT INTO bathrooms(google_id, bathroom_name)
VALUES('asf23SF', 'Sql Bathroom')
`;

export const removeBathroom = `
DELETE FROM bathrooms
WHERE google_id = 'asf23SF'
`;
