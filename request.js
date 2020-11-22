function getType(data, method) { // 获取请求方式
	let type = {}
	if (method=='POST') {
		method = 'POST'
		type = {
			method,
			data: {
				...data
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			}
		}
	} else {
		method = 'GET'
		type = {
			method,
			data: {
				...data
			}
		}
	}
	return type
}

function Request(data, url, method) {

	return new Promise((resolve, reject) => {
		uni.request({
			url: url,
			...getType(data, method),
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				console.log('err')
				reject(err)
			}
		})
	}).catch(err => console.log(err))
	
}


export default function(data, url, method) {
	return Request(data, url, method)
}
