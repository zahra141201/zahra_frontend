import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from './marker-icon.png'; // Assure-toi d'avoir le chemin correct vers ton icône

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

            const customIcon = L.icon({
                iconUrl: markerIcon, // Chemin vers ton icône personnalisée
                iconSize: [32, 32], // Taille de l'icône
                iconAnchor: [16, 32], // Point d'ancrage de l'icône (au milieu en bas)
                popupAnchor: [0, -32] // Point d'ancrage de la popup (au-dessus de l'icône)
            });

            markerRef.current = L.marker([lat, lon], { icon: customIcon }).addTo(mapRef.current);
        } else { // Met à jour la position du marqueur si la carte est déjà initialisée
            markerRef.current.setLatLng([lat, lon]);
        }
    }, [coordinates]);

    return <div ref={mapRef} style={{ height, width }} />;
};

export default Mapa;
