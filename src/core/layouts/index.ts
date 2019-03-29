import { Mind } from "core/Mind";
import { Topic } from "core/Topic";
import { whileFor } from "utils/tools";
import { eleAbsolute } from "utils/view";
import { TSMindDirectionMap } from 'utils/constants';

// 100px
const ROOT_SPACE = 100;
const BRANCH_BETWEEN = 0;
// side order rule
/**
 * left:
 * emp - 1
 * emp - 2
 * emp - 3
 * emp - 4
 *
 * right:
 * 1 - emp
 * 2 - emp
 * 3 - emp
 * 4 - emp
 *
 * bottom:
 *    -
 * 1 2 3 4
 *
 * sides:
 * 2 - 1
 * 4 - 3
 */
export const LayoutMode = {
  left(vm: Mind, branches: Topic[], force: true = true) {
    const root = vm.rootTopic;
    const rootPosition = root.view.getPosition();
    const rootSize = root.view.getSize().container;
    // to balance center position
    let totalHeight = BRANCH_BETWEEN;
    const _dir = -1;
    whileFor(branches, bch => {
      const _cont = bch.view.getSize().container;
      totalHeight += _cont.h + BRANCH_BETWEEN;
    });
    // desc[max->min]
    let beginX = rootPosition.x + _dir * (rootSize.w / 2 + ROOT_SPACE);
    // asc[min->max]
    let beginY = rootPosition.y + _dir * (rootSize.h / 2 + totalHeight / 2 + BRANCH_BETWEEN);
    let mnx = 0;
    let mny = beginY;
    let mxx = rootPosition.x + rootSize.w / 2;
    let mxy = rootPosition.y + rootSize.h / 2;
    whileFor(branches, bch => {
      const _cont = bch.view.getSize().container;
      const x = beginX + _dir * _cont.w;
      mnx = Math.min(mnx, x);
      eleAbsolute(bch.view.$els.container);
      bch.view.setPosition({
        y: beginY,
        x
      });
      mxy = Math.max(beginY, mxy);
      beginY += _cont.h + BRANCH_BETWEEN;
    });
    return {
      mnx,
      mny,
      mxx,
      mxy
    };
  },
  right(vm: Mind, branches: Topic[], force: true = true) {
    const root = vm.rootTopic;
    const rootPosition = root.view.getPosition();
    const rootSize = root.view.getSize().container;
    // to balance center position
    let totalHeight = BRANCH_BETWEEN;
    const _dir = 1;
    whileFor(branches, bch => {
      const _cont = bch.view.getSize().container;
      totalHeight += _cont.h + BRANCH_BETWEEN;
    });
    // asc[min->max]
    let beginX = rootPosition.x + _dir * (rootSize.w / 2 + ROOT_SPACE);
    // asc[min->max]
    let beginY = rootPosition.y + _dir * (rootSize.h / 2 + totalHeight / 2 + BRANCH_BETWEEN);
    let mnx = rootPosition.x - rootSize.w / 2;
    let mny = Math.min(beginY, rootPosition.y - rootSize.h / 2);
    let mxx = beginX;
    let mxy = beginY;
    whileFor(branches, bch => {
      const _cont = bch.view.getSize().container;
      const xw = _cont.w + beginX;
      eleAbsolute(bch.view.$els.container);
      bch.view.setPosition({
        y: beginY,
        x: beginX
      });
      beginY += _cont.h + BRANCH_BETWEEN;
      mxy = Math.max(beginY, mxy);
      mxx = Math.max(mxx, xw);
    });
    return {
      mnx,
      mny,
      mxx,
      mxy
    };
  },
  sides(vm: Mind, branches: Topic[], force: boolean = false) {
    const leftSide: Topic[] = [];
    const rightSide: Topic[] = [];
    whileFor(branches, bch => {
      if (force) {
        // trade all as direction === 'sides', and set direction
        rightSide.length < leftSide.length
          ? (rightSide.push(bch), (bch.direction = TSMindDirectionMap.right))
          : (leftSide.push(bch), TSMindDirectionMap.left);
      } else {
        // already splited
        if (bch.direction === TSMindDirectionMap.left) {
          leftSide.push(bch);
        } else if (bch.direction === TSMindDirectionMap.right) {
          rightSide.push(bch);
        } else {
          // direction === 'sides', and set direction
          rightSide.length < leftSide.length
            ? (rightSide.push(bch), (bch.direction = TSMindDirectionMap.right))
            : (leftSide.push(bch), TSMindDirectionMap.left);
        }
      }
    });
    const leftBorder = LayoutMode.left(vm, leftSide);
    const rightBorder = LayoutMode.right(vm, rightSide);
    return {
      mnx: Math.min(leftBorder.mnx, rightBorder.mnx),
      mny: Math.min(leftBorder.mny, rightBorder.mny),
      mxx: Math.max(leftBorder.mxx, rightBorder.mxx),
      mxy: Math.max(leftBorder.mxy, rightBorder.mxy)
    };
  }
};
