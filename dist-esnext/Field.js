import R from 'ramda';
import { allPositions } from './Position';
/**
 * Checks if field has position.
 */
const positionIsValid = R.curry((positions, p) => p && p.x >= 0
    && p.x < positions.length
    && p.y >= 0
    && p.y < positions[0].length);
/**
 * Receives a pos and return his near positions
 * args {IPositionArgs}
 * returns {IPositionArgs[]}
 */
const nearPositions = (pos) => {
    const range = R.range(-1, 2);
    /**
     * Get a 3x3 position array with the position and all the near positions then remove the position itseft
     */
    return R.flatten(R.remove(4, 1, range.map(i => range.map(j => {
        return { x: pos.x + i, y: pos.y + j };
    }))));
};
const validNearPos = R.curry((position, pos) => R.filter(positionIsValid(position), nearPositions(pos)));
const openPosition = (oldPosition) => {
    const openedPos = updatePos(oldPosition);
    if (openedPos.marked !== 0)
        return openedPos;
    openedPos.opened = true;
    return openedPos;
};
const markPosition = (oldPosition) => {
    const markedPos = updatePos(oldPosition);
    markedPos.marked === 2
        ? markedPos.marked = 0
        : markedPos.marked++;
    return markedPos;
};
const isValidConfig = (fieldConfig) => {
    const totalPositions = fieldConfig.width * fieldConfig.height;
    return totalPositions > fieldConfig.bombs ? true : false;
};
const countNearBombs = (field) => {
    const countedField = field;
    allPositions(field.positions).map(pos => {
        if (pos.isBomb)
            validNearPos(field.positions, pos).map(p => countedField.positions[p.x][p.y].nearBombs++);
    }); // TODO immutable
    return countedField;
};
// TODO use ptz-math and help with any math method you need
const getRandomPos = (positions, fieldConfig) => {
    const width = Math.floor((fieldConfig.width - 1) * Math.random() + 1);
    const height = Math.floor((fieldConfig.height - 1) * Math.random() + 1);
    return positions[width][height];
};
const bombPos = (field, config) => {
    const pos = getRandomPos(field.positions, config);
    if (pos.isBomb) {
        return bombPos(field, config);
    }
    pos.isBomb = true;
    return field;
};
/**
 * Populate new field with bombs
 */
const getBombedField = (field, config) => {
    const fieldToBomb = R.clone(field);
    return R.last(R.range(0, config.bombs).map(() => bombPos(fieldToBomb, config)));
};
const getEmptyField = (fieldConfig) => {
    const widthRange = R.range(0, fieldConfig.width);
    const heightRange = R.range(0, fieldConfig.height);
    return {
        positions: widthRange.map(i => heightRange.map(j => newPos(i, j))),
        fieldConfig
    };
};
/**
 * Get a new position
 */
const newPos = (x, y) => {
    return {
        x, y, isBomb: false, nearBombs: 0,
        opened: false, marked: 0, isValid: true
    };
};
const updatePos = (pos) => R.clone(pos);
const getInitialField = (fieldConfig) => {
    if (!isValidConfig(fieldConfig))
        throw new Error('Invalid field configuration');
    const emptyField = getEmptyField(fieldConfig);
    const bombedField = getBombedField(emptyField, fieldConfig);
    return countNearBombs(bombedField);
};
export { allPositions, getInitialField, getEmptyField, getBombedField, countNearBombs, markPosition, nearPositions, newPos, openPosition, positionIsValid, validNearPos, updatePos };
//# sourceMappingURL=Field.js.map