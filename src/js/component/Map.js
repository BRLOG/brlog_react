import React, { useCallback, useEffect } from 'react';
import OpenLayersMap from '../../openLayers/OpenLayersMap';

import 'ol/ol.css';

function Map({ setMoveToLocation, mapCoordinates }) {
	console.log('Map 호출!!!!!!!!!!!!!!!!!!!!!!')
	const handleMapInitialized = useCallback((moveToLocationFn) => {
		console.log('Map initialized, setting moveToLocation function');
		setMoveToLocation(moveToLocationFn);
	}, [setMoveToLocation]);

	return (
		<div className='h-full'>
			<OpenLayersMap onMapInitialized={handleMapInitialized} mapCoordinates={mapCoordinates} />
		</div>
	);
}

export default React.memo(Map);