interface InformationUnit {
  id: string;
  name: string;
}

interface InformationSubUnit {
  id: string;
  name: string;
}

interface InformationSubSubUnit {
  id: string;
  name: string;
}

interface InformationItem {
  id: string;
  informationUnit: InformationUnit;
  informationSubUnit: InformationSubUnit;
  informationSubSubUnit: InformationSubSubUnit | null;
}

interface EquipmentData {
  data: {
    equipmentByName: {
      informationList: InformationItem[];
    };
  };
}

/**
 * Extrait les informationUnit uniques d'un objet JSON
 * @param jsonData - Les données JSON à parser
 * @returns Un tableau d'informationUnit uniques
 */
function getUniqueInformationUnits(jsonData: EquipmentData): InformationUnit[] {
  return Array.from(
    jsonData.data.equipmentByName.informationList
      .reduce((map, item) => {
        const unit = item.informationUnit;
        return map.has(unit.id) ? map : map.set(unit.id, unit);
      }, new Map<string, InformationUnit>())
      .values()
  );
}

function getUniqueInformationUnitsSorted(jsonData: EquipmentData): InformationUnit[] {
  return Array.from(
    jsonData.data.equipmentByName.informationList.reduce((map, item) => {
      const unit = item.informationUnit;
      return map.has(unit.id) ? map : map.set(unit.id, unit);
    }, new Map<string, InformationUnit>()).values()
  ).sort((a, b) => parseInt(a.id) - parseInt(b.id));
}


export {
  getUniqueInformationUnits,
  getUniqueInformationUnitsSorted
};
