import React, { useEffect, useRef } from 'react';
import axios from 'axios';

function App() {
  const mapElement = useRef(null);

  useEffect(() => {
    const { naver } = window;
    if (!mapElement.current || !naver) return;

    // 출발지와 목적지 좌표
    const startLatLng = new naver.maps.LatLng(37.5656, 126.9769);
    const endLatLng = new naver.maps.LatLng(37.5674, 126.9779);

    // 지도 옵션 설정
    const mapOptions = {
      center: startLatLng,
      zoom: 17,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT,
      },
    };

    // 지도 생성
    const map = new naver.maps.Map(mapElement.current, mapOptions);

    // 출발지, 목적지 마커 생성
    new naver.maps.Marker({ position: startLatLng, map });
    new naver.maps.Marker({ position: endLatLng, map });

    // 경로 검색 API 호출
    const apiKey = '키값 ';
    const apiUrl = `https://naveropenapi.apigw-pub.fin-ntruss.com/map-direction/v1/driving?start=${startLatLng}&goal=${endLatLng}&option=trafast&key=${apiKey}`;

    axios
      .get(apiUrl)
      .then((response) => {
        // API 응답 처리
        const { data } = response;
        const pathCoordinates = data.route.path.map((point: { latitude: number, longitude: number }) => new naver.maps.LatLng(point.latitude, point.longitude));


        // 경로 그리기
        const path = new naver.maps.Polyline({
          map,
          path: pathCoordinates,
          strokeColor: '#f00',
          strokeWeight: 5,
        });

        // 경로에 맞게 지도 영역 조정
const bounds = new naver.maps.LatLngBounds(startLatLng, endLatLng);
pathCoordinates.forEach((latLng: naver.maps.LatLng) => {
  bounds.extend(latLng);
});

map.fitBounds(bounds);


        map.fitBounds(bounds);
      })
      .catch((error) => {
        // 에러 처리
        console.error(error);
      });
  }, []);

  return <div ref={mapElement} style={{ minHeight: '400px' }} />;
}

export default App;