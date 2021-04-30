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

export function lineSegmentIntersect([p1, p2], [p3, p4]) {
    return lineIntersect(p1, p2, p3, p4)
}

// TODO: add ray collision

export function linesIntersect(line1, line2) {

    if (line1.type === 'dot' || line2.type === 'dot') return false;

    if (line1.minX > line2.maxX || line1.maxX < line2.minX || line1.maxY < line2.minY || line1.minY > line2.maxY) return false;

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

export function pointInPoly(point, polyLine) {

    const leftLine = [point, [polyLine.minX - 10, point[1]]]
    const rightLine = [point, [polyLine.maxX + 10, point[1]]]

    let left = 0, right = 0

    const points = polyLine.points
    for (let i = 0; i < points.length; i++) {
        const line = [points[i], (i === points.length - 1) ? points[0] : points[i+1]]

        if (lineSegmentIntersect(line, leftLine)) left++
        if (lineSegmentIntersect(line, rightLine)) right++
    }

    return (left % 2 !== 0 || right % 2 !== 0)
}

export function lineInPoly(line, polyLine) {
    const points = line.points
    for (const point of points) {
        if (!pointInPoly(point, polyLine)) return false
    }
    return true
}

export function erase(lines, eraseLine) {

    if (eraseLine.type === 'dot') return lines

    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i]

        if (line.type === 'dot') {
            if (lineTouchesDot(line, eraseLine)) lines.splice(i, 1)
        } else if (linesIntersect(eraseLine, line)) {
            lines.splice(i, 1)
        }
    }

    return lines
}

export function eraseInPoly(lines, erasePoly) {


    if (erasePoly.points.length < 3) return lines

    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i]

        if (lineInPoly(line, erasePoly)) {
            lines.splice(i, 1)
        }
    }

    return lines
}

export function dist([x1, y1], [x2, y2]) {
    return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2))
}

export function smartLineSnapEnds(lines, line) {

    const validLines = lines.filter(line => line.type === 'line')

    if (line.type === 'dot' || validLines.length === 0) return

    let change = false

    for (const point of [line.points[0], line.points[line.points.length - 1]]) {
        let minPoint = validLines[0].points[0]
        let minDist = dist(point, minPoint)

        for (const line of validLines) {
            const linePoints = line.points
            for (const snapPoint of [linePoints[0], linePoints[linePoints.length - 1]]) {
                const d = dist(point, snapPoint)
                if (d < minDist) {
                    minDist = d
                    minPoint = snapPoint
                }
            }
        }

        if (minDist < 30) {
            point[0] = minPoint[0]
            point[1] = minPoint[1]
            change = true
        }
    }

    return change
}

export function lastLine(lines) {
    return lines[lines.length - 1]
}

export function exceptLast(lines) {
    return lines.slice(0, lines.length - 1)
}