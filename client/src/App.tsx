import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

interface Place {
  id: string;
  name: string;
  x: number;
  y: number;
}

function KakaoMap() {
  const [keyword, setKeyword] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [map, setMap] = useState<any>(null); 

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=56e0838eacaf61521c3d4fed329a1b00&libraries=services`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const mapOptions = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 3,
        };

        const newMap = new window.kakao.maps.Map(mapContainer, mapOptions); 
        setMap(newMap); 

        const placesService = new window.kakao.maps.services.Places();

        const searchPlaces = (keyword: string) => {
          placesService.keywordSearch(keyword, (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
              setPlaces(
                result.map((place: any) => ({
                  id: place.id,
                  name: place.place_name,
                  x: place.x,
                  y: place.y,
                }))
              );
            }
          });
        };

        const markerImage = new window.kakao.maps.MarkerImage(
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
          new window.kakao.maps.Size(64, 69)
        );

        const addMarkersToMap = () => {
          places.forEach((place) => {
            const markerPosition = new window.kakao.maps.LatLng(place.y, place.x);
            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
              image: markerImage,
            });

            marker.setMap(newMap); 

            window.kakao.maps.event.addListener(marker, 'click', () => {
              setSelectedPlace(place);
              newMap.setCenter(markerPosition); 
            });
          });

          if (places.length > 0) {
            const firstPlace = places[0];
            const firstPlacePosition = new window.kakao.maps.LatLng(firstPlace.y, firstPlace.x);
            newMap.setCenter(firstPlacePosition); // 검색에 해당하는 첫 번째 장소로 지도 이동
          }
        };

        addMarkersToMap();
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleSearch = () => {
    const placesService = new window.kakao.maps.services.Places();
    placesService.keywordSearch(keyword, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setPlaces(
          result.map((place: any) => ({
            id: place.id,
            name: place.place_name,
            x: place.x,
            y: place.y,
          }))
        );

        if (map && result.length > 0) {
          const firstPlace = result[0];
          const firstPlacePosition = new window.kakao.maps.LatLng(firstPlace.y, firstPlace.x);
          map.setCenter(firstPlacePosition);
        }
      }
    });
  };

  return (
    <div>
      <div>
        <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
      <div>
        {places.map((place) => (
          <div key={place.id}>{place.name}</div>
        ))}
      </div>
    </div>
  );
}

export default KakaoMap;
