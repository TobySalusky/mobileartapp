// FROM: https://stackoverflow.com/questions/13937782/calculating-the-point-of-intersection-of-two-lines
export function lineIntersect([x1, y1], [x2, y2], [x3, y3], [x4, y4]) {

    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return undefined
    }

    const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

    // Lines are parallel
    if (denominator === 0) {
        return undefined
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return undefined
    }

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)

    return [x, y]
}

// FROM: https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
export function pDistance([x, y], [x1, y1], [x2, y2]) {

    let A = x - x1;
    let B = y - y1;
    let C = x2 - x1;
    let D = y2 - y1;

    let dot = A * C + B * D;
    let len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) //in case of 0 length line
        param = dot / len_sq;

    let xx, yy;

    if (param < 0) {
        xx = x1;
        yy = y1;
    }
    else if (param > 1) {
        xx = x2;
        yy = y2;
    }
    else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    let dx = x - xx;
    let dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

export function linesIntersect(line1, line2) {

    if (line1.type === 'dot' || line2.type === 'dot') return false;

    if (!(line1.minX > line2.maxX || line1.maxX < line2.minX || line1.maxY < line2.minY || line1.minY > line2.maxY)) return true; // I'm confused

    const points1 = line1.points;
    const points2 = line2.points;

    for (let i = 1; i < points1.length; i++) {
        for (let j = 1; j < points2.length; j++) {
            if (lineIntersect(points1[i-1], points1[i], points2[j-1], points2[j])) return true;
        }
    }

    return false;
}

export function lineTouchesDot(dotLine, line) {

    const min = (dotLine.lineWidth + line.lineWidth) / 2

    const dot = dotLine.points[0]

    const points = line.points
    for (let i = 1; i < points.length; i++) {
        if (pDistance(dot, points[i - 1], points[i]) <= min) return true;
    }

    return false;
}

export function erase(lines) {

    lines = [...lines]

    const eraseLine = lines[lines.length - 1]
    lines.splice(lines.length - 1, 1)

    if (eraseLine.type === 'dot') return lines

    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i]

        if (line.type === 'dot' && lineTouchesDot(line, eraseLine)) {
            lines.splice(i, 1)
        } else if (linesIntersect(eraseLine, line)) {
            lines.splice(i, 1)
        }
    }

    return lines
}