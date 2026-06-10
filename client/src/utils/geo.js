export const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Location is not supported in this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6))
        }),
      () => reject(new Error("Location permission denied or unavailable.")),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });

export const formatCoordinate = (value) =>
  Number.isFinite(Number(value)) ? Number(value).toFixed(5) : "";
