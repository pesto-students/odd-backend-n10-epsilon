import axios from "axios";
const get_distance = (latLong) => {
  const api = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${latLong.pickup[0]}%2C${latLong.pickup[1]}&origins=${latLong.dropoff[0]}%2C${latLong.dropoff[1]}&key=AIzaSyDtyq14eeHpWEwCYm50RjBhvt4GqeMENUg`;
  return new Promise((resolve, reject) => {
    axios
      .get(api)
      .then((result) => {
        const distance = result.data.rows[0].elements[0];
        if ((distance.status = "OK")) resolve(result.data.rows[0].elements[0]);
        reject("Can not get distance");
      })
      .catch(reject);
  });
};

export default get_distance;
