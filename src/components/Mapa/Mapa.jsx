import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from './marker-icon.png';

const Mapa = ({ height, width, coordinates, markers }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map').setView([0, 0], 2);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapRef.current);
        }

        if (coordinates) {
            mapRef.current.setView([coordinates.lat, coordinates.lon], 13);
        }

        markers.forEach(marker => {
            L.marker([marker.lat, marker.lon], {
                icon: L.icon({
                    iconUrl: markerIcon,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32]
                })
            }).addTo(mapRef.current);
        });
    }, [coordinates, markers]);

    return <div id="map" style={{ height, width }} />;
};

export default Mapa;
