// import { IBattle, IBattleArgs } from './IBattle';
import { getInitialField } from './Field';
// import { LogFile } from 'ptz-log-file';
// const log = LogFile({});
function startBattle() {
    const fieldConfig = {
        size: {
            x: 10,
            y: 10
        },
        bombs: 10
    };
    const field = getInitialField(fieldConfig);
    return field;
}
export { startBattle };
//# sourceMappingURL=Battle.js.map