import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { ILocationCard, LocationCard } from "../../LocationCard";

import { useLocationsStore } from "../../../store/useLocationsStore.ts";

import cls from "./LocationCardsList.module.scss";

export const LocationCardsList = () => {
  const { fetch, isLoaded } = useLocationsStore();

  const [locationsList, setLocationsList] = useState<ILocationCard[] | []>([]);

  const [titleCounter, setTitleCounter] = useState<number>(1);

  const handleChangeLocation = useCallback((id: number, locationId: number) => {
    setLocationsList((prevList) => prevList.map((item) => item.id === id ? { ...item, locationId } : item));
  }, []);

  const handleChangeEnvironment = useCallback((id: number, environmentID: number) => {
    setLocationsList((prevList) => prevList.map((item) => item.id === id ? { ...item, environmentID } : item));
  }, []);

  const handleChangeHint = useCallback((id: number, hint: string) => {
    setLocationsList((prevList) => prevList.map((item) => item.id === id ? { ...item, hint } : item));
  }, []);


  // Функция, добавляющая тестовую локацию с дефолтным состоянием в список.
  const handleAddLocation = () => {
    const newListElement: ILocationCard = {
      id: Date.now(),
      title: `Тестовая локация ${titleCounter}`,
    };
    setTitleCounter((prev) => prev + 1);
    setLocationsList((locationsList) => [...locationsList, newListElement]);
  };

  // Функция, удаляющая тестовую локацию из списка.
  const handleDeleteLocation = useCallback((id: number) => {
    const newList = locationsList.filter((location) => location.id !== id);
    setLocationsList(() => [...newList]);
  }, [locationsList]);

  const handleShowLogs = () => {
    const normalized = locationsList.map(({locationId, environmentID, hint, id}) => ({
      locationId,
      environmentID,
      hint,
      id
    }))
    console.log(normalized);
  }

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (!isLoaded) {
    return <div>Loading filters...</div>;
  }

  return (
    <>
      <div className={cls.LocationCardsList}>
        {locationsList.map((_location) => (
          <LocationCard
            key={_location.id}
            location={_location}
            deleteLocation={handleDeleteLocation}
            changeLocation={handleChangeLocation}
            changeEnvironment={handleChangeEnvironment}
            changeHint={handleChangeHint}
          />
        ))}
        <div className={cls.actionBtns}>
          <button
            type="button"
            onClick={handleAddLocation}
            className={cls.addCard}
          >
            <FontAwesomeIcon icon={faPlus} />
            Добавить тестовую локацию
          </button>
          <button
            type="button"
            onClick={handleShowLogs}
            className={cls.logsBtn}
          >
            Вывести результат в консоль
          </button>
        </div>
      </div>
    </>
  );
};


