import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from './marker-icon.png';
import userLocationIcon from './user-location-icon.png'; // Icon for user location

const Mapa = ({ height, width, coordinates, markers, userLocation, searchedLocation }) => {
    const mapRef = useRef(null);
    const markerRefs = useRef([]);

    useEffect(() => {
        // Initialize map if not already initialized
        if (!mapRef.current) {
            mapRef.current = L.map('map').setView([0, 0], 2);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapRef.current);
        }

        // Set map view to coordinates if available
        if (coordinates) {
            mapRef.current.setView([coordinates.lat, coordinates.lon], 13);
        }

        // Clear previous markers
        markerRefs.current.forEach(marker => mapRef.current.removeLayer(marker));
        markerRefs.current = [];

        // Add user location marker if available
        if (userLocation) {
            const userMarker = L.marker([userLocation.lat, userLocation.lon], {
                icon: L.icon({
                    iconUrl: userLocationIcon,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32]
                })
            }).addTo(mapRef.current);
            markerRefs.current.push(userMarker);
        }

        // Add searched location marker if available
        if (searchedLocation) {
            const searchMarker = L.marker([searchedLocation.lat, searchedLocation.lon], {
                icon: L.icon({
                    iconUrl: userLocationIcon, // Use userLocationIcon for searched location
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32]
                })
            }).addTo(mapRef.current);
            markerRefs.current.push(searchMarker);
        }

        // Add other markers
        markers.forEach(marker => {
            const newMarker = L.marker([marker.lat, marker.lon], {
                icon: L.icon({
                    iconUrl: markerIcon,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32]
                })
            }).addTo(mapRef.current);
            markerRefs.current.push(newMarker);
        });
    }, [coordinates, markers, userLocation, searchedLocation]);

    return <div id="map" style={{ height, width }} />;
};

export default Mapa;
