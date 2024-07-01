import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Mapa = ({ height, width, coordinates }) => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        if (!coordinates || !mapRef.current) return;

        const { lat, lon } = coordinates;

        // Initialise la carte si elle n'est pas déjà initialisée
        if (!mapRef.current._leaflet_id) {
            mapRef.current = L.map(mapRef.current).setView([lat, lon], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapRef.current);

            markerRef.current = L.marker([lat, lon]).addTo(mapRef.current);
        } else { // Met à jour la position du marqueur si la carte est déjà initialisée
            markerRef.current.setLatLng([lat, lon]);
        }
    }, [coordinates]);

    return <div ref={mapRef} style={{ height, width }} />;
};

export default Mapa;
