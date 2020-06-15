import { observable } from 'mobx';
import { MainWindowState } from '../interfaces/UIStates';

class UIStore {
    @observable mainWindow: MainWindowState = MainWindowState.MAIN_CHAT;

    @observable descriptionModal = false;
}

export default new UIStore();
