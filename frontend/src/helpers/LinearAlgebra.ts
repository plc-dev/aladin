const sum = (list: Array<number>): number => list.reduce((sum, element) => (sum += element), 0);
const basicallyEqual = (one, other, epsilon = 0.00000001): boolean => Math.abs(one - other) < epsilon;

// Original Implemenation -> https://geekrodion.com/blog/linear-algebra

class Vector {
  private elements: Array<number>;
  constructor(...elements: Array<number>) {
    this.elements = elements;
  }

  add({ elements }: Vector): Vector {
    return new Vector(...elements.map((element, index) => this.elements[index] + element));
  }

  subtract({ elements }: Vector): Vector {
    return new Vector(...elements.map((element, index) => this.elements[index] - element));
  }

  scale(number: number): Vector {
    return new Vector(...this.elements.map((element) => element * number));
  }

  getLength(): number {
    return Math.hypot(...this.elements);
  }

  dotProduct({ elements }: Vector) {
    return elements.reduce((acc, element, index) => acc + element * this.elements[index], 0);
  }

  normalize() {
    return this.scale(1 / this.getLength());
  }

  direction(V1: Vector): boolean {
    const dotProduct = this.normalize().dotProduct(V1.normalize());
    return basicallyEqual(dotProduct, 1);
  }
}

class Matrix {
  rows: Array<number>[];
  length: number;
  constructor(...rows: Array<number>[]) {
    this.rows = rows;
    this.length = this.rows.length;
  }

  getRows() {
    return this.rows;
  }

  getColumns() {
    return this.rows[0].map((element, elementIndex) => this.rows.map((row) => row[elementIndex]));
  }

  private elementWiseOperation(operation: Function, { rows }: Matrix): Matrix {
    const result = rows.map((row, rowIndex) => {
      return row.map((element, elementIndex) => {
        return operation(this.rows[rowIndex][elementIndex], element);
      });
    });
    return new Matrix(...result);
  }

  add(M2: Matrix): Matrix {
    return this.elementWiseOperation((a: number, b: number) => a + b, M2);
  }

  subtract(M2: Matrix): Matrix {
    return this.elementWiseOperation((a: number, b: number) => a + b, M2);
  }

  scale(number: number): Matrix {
    const result = this.rows.map((row) => row.map((element) => element * number));
    return new Matrix(...result);
  }

  multiply(M2: Matrix): Matrix {
    if (this.rows[0].length !== M2.rows.length) {
      throw new Error("Matrices do not possess the same rank!");
    }
    const columns = M2.getColumns();
    const result = this.rows.map((row) => columns.map((column) => sum(row.map((element, elementIndex) => element * column[elementIndex]))));
    return new Matrix(...result);
  }

  transpose() {
    return new Matrix(...this.getColumns());
  }

  getDeterminant() {
    if (this.rows.length !== this.rows[0].length) {
      throw new Error("Matrix is not quadratic!");
    }
    if (this.rows.length === 2) {
      return this.rows[0][0] * this.rows[1][1] - this.rows[0][1] * this.rows[1][0];
    }
    const parts = this.rows[0].map((coefficient, index) => {
      const matrixRows = this.rows.slice(1).map((row) => [...row.slice(0, index), ...row.slice(index + 1)]);
      const matrix = new Matrix(...matrixRows);
      const result = coefficient * matrix.getDeterminant();
      return index % 2 === 0 ? result : -result;
    });

    return sum(parts);
  }

  private sliceElementAtIndex(rowOrRows: Array<number>[] | Array<number> | Array<any>, elementIndex: number) {
    return [...rowOrRows.slice(0, elementIndex), ...rowOrRows.slice(elementIndex + 1)];
  }

  getMinor(rowIndex: number, columnIndex: number) {
    const result = this.sliceElementAtIndex(this.rows, rowIndex).map((row: Array<number>) => this.sliceElementAtIndex(row, columnIndex));
    const matrix = new Matrix(...result);
    return matrix.getDeterminant();
  }

  getCofactor(rowIndex: number, columnIndex: number) {
    const sign = Math.pow(-1, rowIndex + columnIndex);
    const minor = this.getMinor(rowIndex, columnIndex);
    return sign * minor;
  }

  map(operation: Function) {
    return new Matrix(...this.rows.map((row, rowIndex) => row.map((element, elementIndex) => operation(element, rowIndex, elementIndex))));
  }

  getAdjugate() {
    return this.map((element, rowIndex, elementIndex) => this.getCofactor(rowIndex, elementIndex)).transpose();
  }

  getInverse(): Matrix {
    const determinant = this.getDeterminant();
    if (determinant === 0) {
      throw new Error("Determinant can't be zero.");
    }
    const adjugate = this.getAdjugate();
    return adjugate.scale(1 / determinant);
  }

  getUnityMatrix() {
    return this.getInverse()
      .multiply(this)
      .map((e: number) => Math.abs(Math.round(e)));
  }

  public getValueInitializedMatrix(value: number | null) {
    return this.map((element) => (element = value));
  }
}

export { Matrix, Vector, sum, basicallyEqual };
