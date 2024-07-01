import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from './marker-icon.png';
import userLocationIcon from './user-location-icon.png'; // Add an icon for user location

const Mapa = ({ height, width, coordinates, markers, userLocation }) => {
    const mapRef = useRef(null);
    const markerRefs = useRef([]);
    const userMarkerRef = useRef(null); // Add ref for user marker

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

        // Clear previous markers
        markerRefs.current.forEach(marker => mapRef.current.removeLayer(marker));
        markerRefs.current = [];

        // Remove user location marker if coordinates are set
        if (coordinates && userMarkerRef.current) {
            mapRef.current.removeLayer(userMarkerRef.current);
            userMarkerRef.current = null;
        }

        // Add user location marker if available and no search coordinates are set
        if (userLocation && !coordinates) {
            userMarkerRef.current = L.marker([userLocation.lat, userLocation.lon], {
                icon: L.icon({
                    iconUrl: userLocationIcon,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32]
                })
            }).addTo(mapRef.current);
            markerRefs.current.push(userMarkerRef.current);
        }

        // Add new markers
        markers.forEach(marker => {
            const iconUrl = marker.isSearchResult ? userLocationIcon : markerIcon; // Use userLocationIcon for search result markers
            const newMarker = L.marker([marker.lat, marker.lon], {
                icon: L.icon({
                    iconUrl: iconUrl,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32]
                })
            }).addTo(mapRef.current);
            markerRefs.current.push(newMarker);
        });
    }, [coordinates, markers, userLocation]);

    return <div id="map" style={{ height, width }} />;
};

export default Mapa;
