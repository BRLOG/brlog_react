import { useState, useCallback, useRef, useEffect } from 'react';
import './App.css';

import axios from 'axios';

import ProductList from './js/component/ProductList';
import Map from './js/component/Map';


import { BrowserRouter as Router, Route, Link, Routes, useNavigate, useLocation } from 'react-router-dom';

const TopNav = () => (
	<nav className="bg-gray-100 py-1 px-4">
		<ul className="flex justify-end space-x-4 text-xs">
			<li>회원가입</li>
			<li>로그인</li>
			<li>장바구니</li>
	  	</ul>
	</nav>
);

const MainHeader = () => (
	<header className="flex items-center justify-between py-8 px-4">
		<div className="text-2xl font-bold">BRBLOG</div>
		<div className="flex-1 max-w-xl mx-4">
			<input
				type="text"
				placeholder="상품 브랜드, 상품명 검색"
				className="w-full border border-green-500 rounded-full py-2 px-4"
			/>
		</div>
		<div className="flex space-x-4">
			<button className='text-sm'>최근본상품</button>
		</div>
	</header>
);


const MainMenuNav = () => (
	<nav className="bg-white border-t border-b">
		<ul className="flex justify-between px-7 py-2 text-lg br-1024">
			<li><Link to="/" className="hover:text-green-500">Home</Link></li>
			<li><Link to="/stock" className="hover:text-green-500">Stock</Link></li>
			<li><Link to="/map" className="hover:text-green-500">Map</Link></li>
			<li><Link to="/br" className="hover:text-green-500">BR</Link></li>
		</ul>
	</nav>
);

function MainContent() {
	let [prod, changeProd] = useState(
		[
			{prod_name: '엔비디아', prod_price: '170000', prod_like: 0, prod_lat_lon: '37.37080442804143,-121.96720013202126'}
			, {prod_name: '애플', prod_price: '210000', prod_like: 0, prod_lat_lon: '37.33481438334459,-122.00901491852889'}
			, {prod_name: '스타벅스', prod_price: '100000', prod_like: 0, prod_lat_lon: '47.5812650015238,-122.33576548928733'}
		]
	);

	const [mapCoordinates, setMapCoordinates] = useState(null);
	const moveToLocationRef = useRef(null);
	const navigate = useNavigate();
	const [responseData, setResponseData] = useState(null); 		// 서버 응답 저장할 상태
	const [responseData2, setResponseData2] = useState(null); 		// 서버 응답 저장할 상태

	const setMoveToLocation = useCallback((fn) => {
		moveToLocationRef.current = fn;
	}, []);

	useEffect(() => {
		if (mapCoordinates && moveToLocationRef.current) {
			const { lon, lat } = mapCoordinates;
			console.log('Calling moveToLocation from MainContent', lon, lat);
			moveToLocationRef.current(parseFloat(lon), parseFloat(lat), true);
		}
	}, [mapCoordinates]);

	const goToMap = useCallback((productIdx) => {
		const item = prod[productIdx];
		if (item.prod_lat_lon) {
			const [lat, lon] = item.prod_lat_lon.split(",");
			setMapCoordinates({ lon, lat });
			navigate('/map');
		}
	}, [prod, navigate]);
	
	function updateLike(productIdx){
		let newProdArr = [...prod];
		newProdArr[productIdx].prod_like = newProdArr[productIdx].prod_like + 1;
		changeProd(newProdArr);
	}

	const callNodeServerAxios = async() => {

		const res = await axios.post('http://localhost:5000/api/data', {
			data: 123
		});
		
		// 서버 응답을 상태에 저장
		setResponseData(res.data);
	};

	const callPythonServerAxios = async() => {

		const res = await axios.post('http://localhost:8000/api/data', {
			data: 456
		});
		
		// 서버 응답을 상태에 저장
		console.log('python res?: ', res)
		setResponseData2(res.data.received_data);
	};

	// 페이지 컴포넌트들
	const HomePage = () => <div className="p-4">메인 페이지</div>;
	const BrPage = () => 
		<div className="p-4">BR 페이지
			<div className="mb-4">
				<button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded" onClick={() => callNodeServerAxios()} style={{marginLeft: '30px'}}> 1. NodeJS AXIOS API 테스트 </button>
				{/* 서버 응답 데이터 표시 */}
				{responseData && (
					<span>  응답: {responseData.receivedData}</span>
				)}
			</div>

			<div className="mb-4">
				<button className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white font-bold py-2 px-4 rounded" onClick={() => callPythonServerAxios()} style={{marginLeft: '30px'}}> 2. Python fastapi axios 테스트 </button>
				{/* 서버 응답 데이터 표시 */}
				{responseData2 && (
					<span>  응답: {responseData2.data}</span>
				)}
			</div>
		</div>;


	////main > tab, screen

	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/stock" element={<ProductList prod={prod} updateLike={updateLike} goToMap={goToMap}></ProductList>} />
			<Route path="/map" element={<Map setMoveToLocation={setMoveToLocation} mapCoordinates={mapCoordinates} />} />
			<Route path="/br" element={<BrPage />} />
		</Routes>
  	);
}

function Main() {
	return (
	  <Router basename="/brblog">
		<div className="w-full h-screen">
			<TopNav />
			<MainHeader />
			<MainMenuNav />
			<MainContent />
		</div>
	  </Router>
	);
}

export default Main;
