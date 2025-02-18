import React from 'react';

function ProductList({ prod, updateLike, goToMap}) {
	console.log('ProductList 호출!!!!!!!!!!!!!!!!!!')
	return (
		<div className='wrap-product-contents'>
			{prod.map((item, index) => (
				<div className={`item ${index === 0 ? 'bg-amber-300' : ''} ${'contents-list'}`}	key={index}>
					<h4>{item.prod_name}</h4>
					<div>
						<span>가격: {item.prod_price}</span>
						<span onClick={() => updateLike(index)} style={{marginLeft: '30px'}}>👍 {item.prod_like}</span>
						<span onClick={() => goToMap(index)} style={{marginLeft: '30px'}}> 지도보기 </span>
					</div>
				</div>
			))}
		</div>
	);
}
  
export default ProductList;