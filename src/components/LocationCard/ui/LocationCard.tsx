import { ChangeEvent, useMemo, useState } from "react";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFlask, faServer, faQuestion } from "@fortawesome/free-solid-svg-icons";

import { useLocationsStore } from "../../../store/useLocationsStore.ts";

import cls from "./LocationCard.module.scss";

export interface ILocationCard {
  id: number;
  title: string;
  locationId?: number;
  environmentID?: number;
  hint?: string;
}

interface ISelect {
  value: number;
  label: string;
}

interface IProps {
  location: ILocationCard;
  deleteLocation: (id: number) => void;
  changeLocation: (id: number, locationId: number) => void;
  changeEnvironment: (id: number, environmentID: number) => void;
  changeHint: (id: number, hint: string) => void;
}

export const LocationCard = (props: IProps) => {
  const { location, changeLocation, deleteLocation, changeEnvironment, changeHint } = props;

  const locationsStore = useLocationsStore();

  // Состояние выбранной локации
  const [selectedLocation, setSelectedLocation] = useState<ISelect>();

  // Состояние выбранной среды
  const [selectedEnvironment, setSelectedEnvironment] = useState<ISelect>();

  // Состояние текста подсказки
  const [hint, setHint] = useState<string>("");

  // Преобразование списка локаций в объект для select
  const locationOptions: ISelect[] = useMemo(() => {
    return locationsStore.locations.map((l) => ({
      value: l.locationID, label: l.name,
    }));
  }, [locationsStore]);

  // Преобразование списка сред в объект для select
  const environmentOptions: ISelect[] = useMemo(() => {
    return locationsStore.environments.map((e) => ({
      value: e.environmentID, label: e.name,
    }));
  }, [locationsStore]);

  // Фильтрование серверов
  const servers = useMemo(() => {
    return locationsStore.servers.filter(s => s.locationID === location.locationId && s.environmentID === location.environmentID);
  }, [location, locationsStore]);

  const handleChangeLocation = (options: ISelect | null) => {
    if (options) {
      setSelectedLocation(options);
      changeLocation(location.id, options.value);
    }
  };

  const handleChangeEnvironment = (options: ISelect | null) => {
    if (options) {
      setSelectedEnvironment(options);
      changeEnvironment(location.id, options.value);
    }
  };

  // Изменяет состояние текста подсказки
  const handleChangeHint = (e: ChangeEvent<HTMLInputElement>) => {
    const hintValue = e.target.value;
    changeHint(location.id, hintValue);
    setHint(hintValue);
  };

  return (
    <div className={cls.LocationCard}>
      <h1 className={cls.LocationCard__title}>
        <FontAwesomeIcon icon={faFlask} />
        {location.title}
      </h1>
      <div className={cls.form__top}>
        <label className={cls.locationLabel}>
          Локация
          <Select
            value={selectedLocation}
            options={locationOptions}
            onChange={(option: ISelect | null) => handleChangeLocation(option)}
            className={cls.locationSelect}
          />
        </label>
        <label className={cls.environmentLabel}>
          Среда
          <Select
            value={selectedEnvironment}
            options={environmentOptions}
            onChange={(option: ISelect | null) => handleChangeEnvironment(option)}
            className={cls.environmentSelect}
          />
        </label>
        {
          servers.length !== 0 && (
            <div className={cls.servers}>
              <p className={cls.servers__text}>Серверы</p>
              <FontAwesomeIcon icon={faServer} className={cls.servers__icon} />
              <div className={cls.servers__list}></div>
              {
                servers.map((s, idx) => (
                  <span className={cls.servers__item}
                        key={s.name}>{s.name + (idx !== servers.length - 1 ? "," : "")}</span>
                ))
              }
            </div>
          )
        }
      </div>
      <label className={cls.hintLabel}>
        Подсказка
        <div className={cls.hintInput__wrapper}>
          <FontAwesomeIcon icon={faQuestion} className={cls.hintQuestionMark} />
          <input
            className={cls.hintInput}
            type="text"
            placeholder={"Комментарий по локации"}
            value={hint}
            onChange={handleChangeHint}
          />
        </div>
      </label>
      <button
        className={cls.deleteBtn}
        onClick={() => deleteLocation(location.id)}
      >
        <FontAwesomeIcon className={cls.deleteBtn__icon} icon={faTrash} />
      </button>
    </div>
  );
};
