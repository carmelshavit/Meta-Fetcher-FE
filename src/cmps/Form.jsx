/** @format */

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
// import { fetchMetadata } from '../service/form.service';

function UrlForm() {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		defaultValues: { urls: [{ url: '' }, { url: '' }, { url: '' }] },
	});

	const { fields, append } = useFieldArray({
		control,
		name: 'urls',
	});

	const [metadata, setMetadata] = useState([]);

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

			const data = await response.json();
			return data;
		} catch (error) {
			console.error(`Failed to fetch metadata for ${url}:`, error);
			return null;
		}
	};

	const onSubmit = async (data) => {
		console.log('Submitted URLs:', data.urls);
		const results = await Promise.all(
			data.urls.map((urlObj) => fetchMetadata(urlObj.url))
		);
		console.log('Results:', results); // Add logging
		console.log(metadata);
		setMetadata(results.filter((result) => result !== null)); // Filter out any null results
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				{fields.map((field, index) => (
					<div key={field.id}>
						<input
							type="url"
							placeholder={`URL ${index + 1}`}
							{...register(`urls.${index}.url`, {
								required: 'This field is required',
								pattern: {
									value: /^https?:\/\/[^\s$.?#].[^\s]*$/,
									message: 'Invalid URL',
								},
							})}
						/>
						{errors.urls?.[index] && <p>{errors.urls[index].message}</p>}
					</div>
				))}

				<button
					className="url-btn"
					type="button"
					onClick={() => append({ url: '' })}>
					Add another URL
				</button>

				<button className="submit-btn" type="submit">
					Submit
				</button>
			</form>

			{/* Display the fetched metadata */}
			<div>
				{metadata.map((meta, index) => (
					<div
						key={index}
						style={{
							border: '1px solid #ccc',
							padding: '10px',
							margin: '10px 0',
						}}>
						<h3>{meta.title}</h3>
						<p>{meta.description}</p>
						{meta.image && (
							<img
								src={meta.image}
								alt={meta.title}
								style={{ maxWidth: '100%' }}
							/>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

export default UrlForm;
