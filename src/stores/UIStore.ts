import { observable } from 'mobx';
import { MainWindowState } from '../interfaces/UIStates';

class UIStore {
    @observable mainWindow: MainWindowState = MainWindowState.MAIN_CHAT;
}

export default new UIStore();
