import React, { useState } from "react";

const cardStyle: React.CSSProperties = {
	background: '#FAF7ED',
	borderRadius: '10px',
	width: '400px',
	height: '400px',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
	fontFamily: 'Inder, sans-serif',
	overflowY: 'auto', 
	maxHeight: '400px',
};


export const Filters: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
	const [radius, setRadius] = useState(25);
	const [useLocation, setUseLocation] = useState(false);
	const filterOptions = [
		'Food', 'Art', 'Houseparty', 'Clubs', 'Career', 'Theater', 'Comm. Mtgs.', '21+ Drinks', 'Shopping', 'Miscellaneous'
	];
	const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

	const toggleFilter = (filter: string) => {
		setSelectedFilters(selectedFilters =>
			selectedFilters.includes(filter)
				? selectedFilters.filter(f => f !== filter)
				: [...selectedFilters, filter]
		);
	};

	return (
		<div style={cardStyle}>
			<h2>Discovery Settings</h2>
			<div style={{ width: '90%', marginTop: 16 }}>
							<h3 style={{ margin: 0 }}>Search Radius</h3>
							<input
								type="range"
								min={0}
								max={100}
								value={radius}
								onChange={e => setRadius(Number(e.target.value))}
								style={{ width: '100%', marginTop: 8, accentColor: '#7793C2' }}
							/>
							<div style={{ textAlign: 'center', marginTop: 4, fontSize: 15 }}>
								{radius} miles
							</div>
							<div style={{ display: 'flex', alignItems: 'center', marginTop: 16 }}>
								<h3 style={{ margin: 0 }}>Use current location</h3>
								<input
									type="checkbox"
									id="use-location"
									checked={useLocation}
									onChange={e => setUseLocation(e.target.checked)}
									style={{ marginLeft: 8, accentColor: '#7793C2' }}
								/>
							</div>
				
				<div style={{ marginTop: 24, marginBottom: 10 }}>
					<h3 style={{ marginBottom: 8, fontSize: 16 }}>Tags</h3>
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							gap: '8px',
							width: '100%',
						}}
					>
						{filterOptions.map(option => (
							<button
								key={option}
								onClick={() => toggleFilter(option)}
								style={{
									padding: '6px 14px',
									borderRadius: '20px',
									border: selectedFilters.includes(option) ? '2px solid #7793C2' : '1px solid #ccc',
									background: selectedFilters.includes(option) ? '#BAC67A' : '#f3f4f6',
									cursor: 'pointer',
									fontSize: 14,
									transition: 'all 0.15s',
									outline: 'none',
								}}
							>
								{option}
							</button>
						))}
					</div>
				</div>
			</div>
			{children}
		</div>
	);
};

