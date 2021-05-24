import { observable, action } from 'mobx'
import { Api } from "../../services/api"
import { myLog } from "../../utils/log"

class CitiesStore {
    @observable isLoading = true;
    @observable isError = false;
    @observable data = [];

    @action
    async GetCities() {
      this.isLoading = true
      const response = await Api.getInstance().getCities()
      myLog(response)
      if (response.kind === 'ok') {
        this.data = response.data
      }
      this.isLoading = false
    }
}

const citiesStore = new CitiesStore()

export default citiesStore
