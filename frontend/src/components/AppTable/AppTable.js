import './AppTable.scss';
import Table from 'react-bootstrap/Table';
import {useEffect, useState} from "react";
import moment from "moment";
import {Button} from "react-bootstrap";

const headArray = [ "ID", "Марка/модель", "Модификация","Комплектация","Стоимость", "Дата создания"];

const startedSetting = {
  currentMark: "Audi",
  currentModel: [],
  currentPaginationLimit: 5,
  currentPaginationPageNumber: 1
};


export const devUrl = (url) => {
  if (process.env.NODE_ENV === "development") {
    return `http://localhost:3010${url}`;
  }
  return url;
};

const getCarsAndCount = async (callback) => {
  console.log("getCarsAndCount");
  const response = await fetch(devUrl("/api/marks"));
  const data = await response.json();
  data && callback(data);
}

const postCars = async (setting, callback) => {
  console.log("postCars");
  const response = await fetch(devUrl("/api"), {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(setting)
  });
  const data = await response.json();
  console.log(data);
  data && callback(data);
}


function AppTable() {

  const [counterModels, setCounterModels] = useState([ { mark: 'Audi', count: 50 }, { mark: 'Reno', count: 25 }]);
  const [setting, setSetting] = useState(startedSetting);
  const [activeMark, setActiveMark] = useState(startedSetting.currentMark);
  const [carList, setCarList] = useState([]);
  const [error, setError] = useState("");

  const handleChangeMark = (mark) => {
    if (setting.currentMark !== mark) {
      setActiveMark(mark);
      setSetting({
        ...setting,
        currentMark: mark,
        currentModel: []
      })
    }
  }

  console.log("carList", carList);
  console.log("setting", setSetting);

  useEffect(() => {
    postCars(setting, setCarList);
  },[setting])

  useEffect(() => {
    getCarsAndCount(setCounterModels)
        .then(r => console.log("Ok"))
        .catch(e => setError(e));
  },[])

  return (
    <div className="container-table">
      <h2 className=".text-danger d-flex justify-content-start mb-3">Car List</h2>
      <div class="d-flex flex-row mb-2">
        {
          counterModels && counterModels.map(({ mark, count }, index) => {
          return (
              <Button
                  key={index}
                  type="button"
                  className={activeMark === mark ? "active btn btn-light button-width d-flex flex-row justify-content-center mx-1" : "btn btn-light button-width d-flex flex-row justify-content-center mx-1"}
                  onClick={() => handleChangeMark(mark)}
              >
                  <div className={activeMark === mark ? "me-1 text-primary" : "me-1 text-primary text-opacity-75"}>
                    {mark}
                  </div>
                  <div className="text-secondary mx-1">
                    {count}
                  </div>
              </Button>
          )
          })
        }
      </div>
      {
          !error ? <Table bordered className="w-auto">
          <thead>
          <tr>
            {
              headArray.map((head) => <th>{head}</th>)
            }
          </tr>
          </thead>
          <tbody>
          {
              carList && carList.map((car) => {
                console.log(car._id);
                return (
                    <tr>
                      <td>{car._id}</td>
                      <td>{car.mark + " " + car.model}</td>
                      <td>
                        {car.engine.volume + " " + car.engine.transmission + " (" + car.engine.power + " л.c.) "}
                        {car.drive ? car.drive : "" }
                      </td>
                      <td>{car.equipmentName}</td>
                      <td>
                        {car.price.toString().split('').reverse().map((el, index) => index % 3 !== 2 ? el : ` ${el}`).reverse().join('')}
                        {" р"}
                      </td>
                      <td>{moment(car.createdAt).format('MM.DD.YYYY hh:mm')}</td>
                    </tr>
                )
              })
          }
          </tbody>
        </Table>
              : <h5 className=".text-danger">{error}</h5>
      }

    </div>
  );
}

export default AppTable;
