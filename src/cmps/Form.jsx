/** @format */

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa';

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
		console.log('Results:', results);
		setMetadata(results.filter((result) => result !== null));
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{fields.map((field, index) => (
						<div key={field.id} className="flex flex-col">
							<input
								type="url"
								placeholder={`URL ${index + 1}`}
								className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								{...register(`urls.${index}.url`, {
									required: 'This field is required',
									pattern: {
										value: /^https?:\/\/[^\s$.?#].[^\s]*$/,
										message: 'Invalid URL',
									},
								})}
							/>
							{errors.urls?.[index] && (
								<p className="text-red-500 text-sm mt-1">
									{errors.urls[index].message}
								</p>
							)}
						</div>
					))}

					<div className="flex justify-between items-center space-x-4">
						<button
							className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600 transition"
							type="button"
							onClick={() => append({ url: '' })}>
							<FaPlus className="mr-2" /> Add another URL
						</button>

						<button
							className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
							type="submit">
							Submit
						</button>
					</div>
				</form>

				{/* Display the fetched metadata */}
				<div className="mt-8 space-y-4">
					{metadata.map((meta, index) => (
						<div
							key={index}
							className="border border-gray-300 rounded p-4 bg-white shadow">
							{/* Title for each result section */}
							<h2 className="text-xl font-bold mb-4">Result {index + 1}</h2>

							<h3 className="text-lg font-semibold">{meta.title}</h3>
							<p className="text-gray-700">{meta.description}</p>
							{meta.image && (
								<img
									src={meta.image}
									alt={meta.title}
									className="mt-4 max-w-xs mx-auto rounded"
								/>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default UrlForm;
