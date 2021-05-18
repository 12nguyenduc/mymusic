import { observable, action } from 'mobx'
import { Api } from "../../services/api"
import { myLog } from "../../utils/log"

class SplashStore {
    @observable isLoading = true;
    @observable isError = false;
    @observable tokenValid = {};

    @action
    async checkToken(id: string, token: string, onSuccess?: Function, onError?: Function) {
      this.isLoading = true
      const response = await Api.getInstance().checkToken(id, token)
      myLog(response)
      if (response.kind === 'ok') {
        this.isLoading = false
        this.isError = false
        onSuccess(response.Data)
      } else {
        this.isLoading = false
        this.isError = false
        onError()
      }
    }
}

const splashStore = new SplashStore()

export default splashStore
