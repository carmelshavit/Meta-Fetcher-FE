/** @format */

const fetchMetadata = async (url) => {
	try {
		const response = await fetch(
			`http://localhost:3001/api/metadata?url=${encodeURIComponent(url)}`,
			{
				method: 'GET',
			}
		);

		if (!response.ok) {
			throw new Error(
				`Network response was not ok. Status: ${response.status}`
			);
		}

		const data = await response.text();
		return data;
	} catch (error) {
		console.error(`Failed to fetch metadata for ${url}:`, error);
		return null;
	}
};

export default fetchMetadata;
