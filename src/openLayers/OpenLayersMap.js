import React, { useEffect, useRef, useCallback } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { fromLonLat } from 'ol/proj';


function OpenLayersMap({ onMapInitialized, mapCoordinates }) {
	const mapRef = useRef();
	const mapInstanceRef = useRef(null);

	const moveToLocation = useCallback((lon, lat, animate = false) => {
		console.log('moveToLocation called with:', lon, lat, animate);
		if (!mapInstanceRef.current) {
			console.log('moveToLocation mapInstanceRef.current not initialized!');
			return;
		}
		const view = mapInstanceRef.current.getView();
		const location = fromLonLat([parseFloat(lon), parseFloat(lat)]);

		console.log('Transformed location:', location);

		if (animate) {
			view.animate({
				center: location,
				duration: 2000,
				zoom: 15
			});
		} else {
			view.setCenter(location);
			view.setZoom(15);
		}
	}, []);

	useEffect(() => {
		console.log('Map component mounted');
		if (mapRef.current && !mapInstanceRef.current) {
			const map = new Map({
				target: mapRef.current,
				layers: [
					new TileLayer({
						source: new OSM()
					})
				],
				view: new View({
					center: fromLonLat([126.9780, 37.5665]),
					zoom: 10
				})
			});

			// 마커 추가
			const marker = new Feature({
				geometry: new Point(fromLonLat([126.9780, 37.5665])) // 서울의 경도, 위도
			});

			const vectorSource = new VectorSource({
				features: [marker]
			});

			const vectorLayer = new VectorLayer({
				source: vectorSource
			});

			map.addLayer(vectorLayer);

			// 지도 클릭 이벤트 처리
			map.on('click', function (evt) {
				const coordinate = evt.coordinate;
				console.log('Clicked coordinate:', coordinate);

				// 클릭한 위치에 새 마커 추가
				const newMarker = new Feature({
					geometry: new Point(coordinate)
				});
				vectorSource.addFeature(newMarker);
			});
			
			//setMap(map);
			mapInstanceRef.current = map;

			if (onMapInitialized) {
				console.log('Calling onMapInitialized');
				onMapInitialized(moveToLocation);
			}

			if (mapCoordinates) {
				const { lon, lat } = mapCoordinates;
				console.log('Moving to coordinates:', lon, lat);
				moveToLocation(parseFloat(lon), parseFloat(lat), true);
			}
		}

		// 컴포넌트 언마운트 시 지도 정리
		return () => {
			if (mapInstanceRef.current) {
				console.log('Map component unmounting');
				mapInstanceRef.current.setTarget(undefined);
				mapInstanceRef.current = null;
			}
		}
	}, []);

	// useEffect(() => {
	// 	if (mapCoordinates) {
	// 		const { lon, lat } = mapCoordinates;
	// 		console.log('Moving to coordinates:', lon, lat);
	// 		moveToLocation(parseFloat(lon), parseFloat(lat), true);
	// 	}
	// }, [mapCoordinates, moveToLocation]);

	return <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>;
}


export default React.memo(OpenLayersMap);