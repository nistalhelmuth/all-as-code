
const URL = 'http://localhost:4000';

export const fetchVms = () => new Promise((resolve, reject) => {
  fetch(`${URL}/vms/`).then((resultado) => {
    if (resultado.ok) {
      resultado.json().then((res) => resolve(res));
    } else {
      resultado.json().then((error) => reject(error));
    }
  }).catch((error) => reject(error));
});

export const fetchVmStatus = (
  ip
) => fetch(`http://${ip}:8000/logs.txt`, ).then((resultado) => {
    console.log(resultado)
});
  
export const createVm = (
  name,
  type,
) => new Promise((resolve, reject) => {
  fetch(`${URL}/createvm?name=${name}&type=${type}`, {
    method: 'POST',
  }).then((resultado) => {
    if (resultado.ok) {
      resultado.json().then((res) => resolve(res));
    } else {
      resultado.json().then((error) => reject(error));
    }
  }).catch((error) => reject(error));
});    
  
  
export const deleteVm = (
  name,
) => new Promise((resolve, reject) => {
  fetch(`${URL}/deletevm?name=${name}`, {
    method: 'POST',
  }).then((resultado) => {
    if (resultado.ok) {
      resultado.json().then((res) => resolve(res));
    } else {
      resultado.json().then((error) => reject(error));
    }
  }).catch((error) => reject(error));
});
