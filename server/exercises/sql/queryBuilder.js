const { getRandomInt, replaceAt } = require("../../helper");

module.exports = async (db, options) => {
  const reflectDB =
    "SELECT sql FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';";

  const rawDB = await db.adapter.queryDB(db, reflectDB);
  const parsedDB = await require("./parser/sqlParser")({
    sourceCode: rawDB,
    sourceFlavour: "json",
    db
  });

  // set unique alias for every table
  let aliasDictionary = parsedDB.tables
    .map(table => table.tableName)
    .reduce((aliasDictionary, name) => {
      aliasDictionary[name] = name.match(/[A-Z]/g).join("");
      return aliasDictionary;
    }, {});
  const findDuplicates = aliasDictionary =>
    Object.keys(aliasDictionary).reduce((duplicates, table) => {
      if (
        Object.keys(aliasDictionary)
          .filter(
            t => aliasDictionary[table] === aliasDictionary[t] && table !== t
          )
          .map(table => aliasDictionary[table])
          .includes(aliasDictionary[table])
      ) {
        duplicates[table] = aliasDictionary[table];
      }
      return duplicates;
    }, {});
  let duplicates = findDuplicates(aliasDictionary);
  while (Object.keys(duplicates).length) {
    Object.keys(duplicates).forEach(table => {
      const alreadyAdded = duplicates[table].match(/[a-z]*/).length
        ? duplicates[table].match(/[a-z]*/)
        : "";
      const regex = new RegExp(`${alreadyAdded}([a-z])`, "gi");
      aliasDictionary[table] = aliasDictionary[table] + table.match(regex)[1];
      delete duplicates[table];
    });
  }

  options = options || {
    join: Math.random() > 0.5,
    joinAmount: 1,
    tables: [],
    columns: {},
    groupBy: false
  };

  // TODO implement breadth-first search for all nodes with paths greater > 2 for JOINs over multiple tables
  const table = randomTable(parsedDB.tables);
  let joinWith = [];
  if (options.join) {
    let temp = table;
    for (let i = 0; i < options.joinAmount; i++) {
      let joinables = joinable(temp, parsedDB.edges);
      const length = joinables.length;
      if (length) {
        const joining = joinables[getRandomInt(0, length - 1)];
        joinWith.push(joining);
        temp = joining;
      }
    }
  }
  options.tables = [table, ...joinWith];

  const columns = options.tables.reduce((columns, table) => {
    columns[table] = getColumns(table, parsedDB.tables);
    return columns;
  }, {});

  let selectedColumns = Object.keys(columns).reduce(
    (selectedColumns, table) => {
      selectedColumns[table] = columns[table].filter(
        () => Math.random() > 0.85
      );
      return selectedColumns;
    },
    {}
  );
  // TODO properly randomize if no column was selected
  if (
    !Object.keys(selectedColumns).reduce(
      (count, table) => (count += selectedColumns[table].length),
      0
    )
  )
    selectedColumns = Object.keys(columns).reduce(
      (selectedColumns, table, index) => {
        if (!index)
          selectedColumns[table] = columns[table].filter(
            (column, index) => index === 0
          );
        return selectedColumns;
      },
      {}
    );
  options.columns = selectedColumns;

  return await constructQuery(options, parsedDB, db, aliasDictionary);
};

const randomTable = tables =>
  tables[getRandomInt(0, tables.length - 1)].tableName;

const joinable = (tableName, edges) =>
  edges
    .filter(edge => edge.some(table => table.table === tableName))
    .reduce((joinable, edge) => {
      let table = edge
        .filter(table => table.table !== tableName)
        .map(table => table.table);
      if (!table.length) table = [tableName];
      return [...joinable, ...table];
    }, []);

const getColumns = (selectedTable, tables) =>
  tables.find(table => table.tableName === selectedTable).columns;

const randomOperator = operators =>
  operators[getRandomInt(0, operators.length - 1)];

// Querybuilder
const constructQuery = async (
  { tables, columns, groupBy, joinAmount },
  parsedDB,
  db,
  aliasDictionary
) => {
  let questionBluePrint = {
    columns: [],
    tables: [],
    where: [],
    whereConcatenation: [],
    groupBy: [],
    orderBy: []
  };

  const constructColumn = columns =>
    Object.keys(columns)
      .reduce(
        (strings, table) => [
          ...strings,
          ...columns[table].map(column => {
            let col = "";
            if (
              Math.random() > 0.7 &&
              ["INT", "INTEGER", "REAL"].includes(column.type)
            ) {
              col = constructAggregateColumn(table, column);
            } else {
              if (!(questionBluePrint.columns.column === column.columnName)) {
                questionBluePrint.columns.push({
                  column: column.columnName,
                  aggregate: null
                });
              }
              col = `${aliasDictionary[table]}.${column.columnName}`;
            }
            return col;
          })
        ],
        []
      )
      .join(", ");

  const constructAggregateColumn = (table, column) => {
    const aggregateTypes = db.adapter.aggregateTypes;
    const aggregateFunction =
      aggregateTypes[getRandomInt(0, aggregateTypes.length - 1)];

    if (
      !(
        questionBluePrint.columns.column === column.columnName &&
        questionBluePrint.columns.aggregate === aggregateFunction
      )
    ) {
      questionBluePrint.columns.push({
        column: column.columnName,
        aggregate: aggregateFunction
      });
    }

    return `${aggregateFunction}(${aliasDictionary[table]}.${column.columnName})`;
  };

  const constructFrom = (tables, edges) => {
    let fromStatement = ` FROM "${tables[0]}" as ${aliasDictionary[tables[0]]}`;
    if (tables.length > 1) {
      fromStatement += constructJoin(edges, tables);
    } else {
      questionBluePrint.tables.push({ table: tables[0] });
    }
    return fromStatement;
  };

  const constructJoin = (edges, tables) => {
    let selectedEdges = edges.reduce((edges, edge) => {
      // remove already joined tables or keep possible false positives for another check
      let check = [...tables].filter((table, index) => {
        if (joinAmount < edges.length) return false;
        else return true;
      });
      const res = edge.every(table => {
        let tableFound = check.includes(table.table);
        if (tableFound) {
          check = check.filter(t => t !== table);
        }
        return tableFound;
      });
      if (res) {
        edges.push(edge);
      }
      return edges;
    }, []);

    // make sure order of the referenced tables in edges is equivalent to the order of join-operations
    for (let i = 0; i < tables.length; i++) {
      if (tables[i] !== selectedEdges[0][i].table) {
        const temp = selectedEdges[0][i];
        selectedEdges[0][i] = selectedEdges[0][i + 1];
        selectedEdges[0][i + 1] = temp;
      }
    }

    const join = selectedEdges.reduce((joinStatement, edge) => {
      let alias0 = aliasDictionary[edge[0].table];
      let alias1 = aliasDictionary[edge[1].table];
      // TODO: rewrite for multiple joins:
      if (tables[0] === tables[1]) {
        alias1 = alias1 + "1";
      }
      // TODO: MAKE AGNOSTIC; PUT IN ADAPTER;
      const joinTypes = [
        "LEFT JOIN",
        "LEFT OUTER JOIN",
        "CROSS JOIN",
        "INNER JOIN"
      ];

      const joinType = randomOperator(joinTypes);
      let join;

      questionBluePrint.tables.push({
        table: edge[0].table,
        joining: edge[1].table,
        type: joinType
      });

      if (joinType === "CROSS JOIN") {
        join = ` CROSS JOIN "${edge[1].table}" as ${alias1} `;
      }

      join =
        ` ${joinType} "${edge[1].table}" as ${alias1}` +
        ` ON ${alias0}.${edge[0].column.join(", ")}` +
        ` = ${alias1}.${edge[1].column.join(", ")} `;

      return (joinStatement += join);
    }, "");
    return join;
  };

  const constructWhere = async (selectedTables, tables, db) => {
    // TODO: add NOT, IN(), EXISTS --> subqueries INTO ADAPTER
    const numericOperators = db.adapter.numericOperators;
    const textOperators = db.adapter.textOperators;

    const columns = selectedTables.reduce((columns, table) => {
      columns[table] = getColumns(table, tables).filter(
        () => Math.random() > 0.9
      );
      if (!columns[table].length) delete columns.table;
      return columns;
    }, {});

    if (!Object.keys(columns).length) return "";

    const getList = async (db, column) => {
      const query = Object.keys(column).reduce(
        (query, table) =>
          `SELECT ${column[table].columnName} FROM "${table}" ORDER BY ${column[table].columnName}`,
        ""
      );
      return await db.adapter.queryDB(db, query);
    };

    // TODO
    const constraint = await Object.keys(columns).reduce(
      async (constraints, table) => {
        const constraintsFromTable = await columns[table].reduce(
          async (constraint, column) => {
            const list = await getList(db, { [table]: column });
            const temp = await constraint;
            const columnName = column.columnName;

            if (list.length) {
              // TODO INCLUDE INTO ADAPTER TO MAKE IT AGNOSTIC
              if (
                ["INT", "INTEGER", "NUMBERIC", "REAL"].includes(column.type)
              ) {
                let [min, max] = list.filter(
                  (entry, index, entries) =>
                    !index || index === entries.length - 1
                );
                min = min[columnName];
                max = max[columnName];
                let operator = randomOperator(numericOperators);
                // TODO, INCLUDE SUBQUERY AS POSSIBLE VALUE
                let value = list[getRandomInt(0, list.length - 1)][columnName];
                if (value != null) {
                  // ensure that result is not empty
                  if (
                    (min === max || value === min || value === max) &&
                    (operator === ">" || operator === "<")
                  ) {
                    const filteredOperators = numericOperators.filter(
                      operator => operator !== "<" || operator !== ">"
                    );
                    operator = randomOperator(filteredOperators);
                  }
                  if (operator === "BETWEEN") {
                    const secondValue =
                      list[getRandomInt(0, list.length - 1)][columnName];
                    questionBluePrint.where.push({
                      column: columnName,
                      operator: "BETWEEN",
                      value1: value,
                      value2: secondValue
                    });
                    temp.push(
                      `${aliasDictionary[table]}.${columnName} BETWEEN '${value}' AND '${secondValue}'`
                    );
                  } else {
                    questionBluePrint.where.push({
                      column: columnName,
                      operator,
                      value
                    });
                    temp.push(
                      `${aliasDictionary[table]}.${columnName} ${operator} '${value}'`
                    );
                  }
                } else {
                  const nullDirection = getRandomInt(0, 1)
                    ? "IS NULL"
                    : "IS NOT NULL";
                  questionBluePrint.where.push({
                    column: columnName,
                    operator: nullDirection,
                    value: null
                  });
                  temp.push(
                    `${aliasDictionary[table]}.${columnName} ${nullDirection}`
                  );
                }
              }

              if (["TEXT", "VARCHAR", "CHAR", "STRING"].includes(column.type)) {
                let operator = randomOperator(textOperators);
                let value = list[getRandomInt(0, list.length - 1)][columnName];
                if (value != null) {
                  if (operator === "LIKE") {
                    let startOfString = getRandomInt(0, value.length - 1);
                    let endOfString = getRandomInt(0, value.length - 1);
                    if (startOfString > endOfString) {
                      // ES6 trick to swap variables in place without temporary variable
                      [startOfString, endOfString] = [
                        endOfString,
                        startOfString
                      ];
                    }
                    if (startOfString === endOfString) {
                      if (endOfString === 0) endOfString++;
                      if (startOfString === value.lenght - 1) startOfString--;
                    }
                    value = value.substring(startOfString, endOfString);
                    if (endOfString !== value.length - 1) value += "%";
                    if (startOfString !== 0) value = "%" + value;
                  }
                  questionBluePrint.where.push({
                    column: columnName,
                    operator,
                    value: value.trim()
                  });
                  temp.push(
                    `${
                      aliasDictionary[table]
                    }.${columnName} ${operator} '${value.trim()}'`
                  );
                } else {
                  const nullDirection = getRandomInt(0, 1)
                    ? "IS NULL"
                    : "IS NOT NULL";
                  questionBluePrint.where.push({
                    column: columnName,
                    operator: nullDirection,
                    value: null
                  });
                  temp.push(
                    `${aliasDictionary[table]}.${columnName} ${nullDirection}`
                  );
                }
              }
            }
            return temp;
          },
          []
        );
        const temp = await constraints;
        temp.push(constraintsFromTable);
        return temp;
      },
      []
    );
    let result = constraint.flat().join(" OR ");
    if (!result) {
      return "";
    } else {
      let orFound = true;
      let orIndices = [];
      let index = 0;
      // randomize OR and AND between constraints
      while (~orFound) {
        orFound = result.indexOf(" OR ", index);
        if (~orFound) {
          const concatWith = Math.random() > 0.6 ? " AND " : " OR ";
          orIndices.push({
            index: orFound,
            replaceWith: concatWith
          });
          index = orFound + 4;

          questionBluePrint.whereConcatenation.push(concatWith);
        }
      }
      orIndices.forEach(found => {
        result = replaceAt(result, found.replaceWith, found.index, 4);
      });

      return ` WHERE ${result}`;
    }
  };

  const constructGroupBy = (selectedTables, tables) => {
    const columns = selectedTables.reduce((columns, table) => {
      columns[table] = getColumns(table, tables).filter(
        () => Math.random() > 0.8
      );
      if (!columns[table].length) delete columns[table];
      return columns;
    }, {});

    const groups = Object.keys(columns).reduce(
      (groups, table) => [
        ...groups,
        ...columns[table].reduce((group, column) => {
          questionBluePrint.groupBy.push(column.columnName);

          group.push(`${aliasDictionary[table]}.${column.columnName}`);
          return group;
        }, [])
      ],
      []
    );

    groupBy = true;
    return " GROUP BY " + groups.join(", ");
  };

  const constructHaving = () => {
    if (!groupBy) return "";
  };

  const constructSubQuery = () => {};

  const constructOrderBy = columns => {
    const orderBy = Object.keys(columns)
      .reduce(
        (orderBy, table) => [
          ...orderBy,
          ...columns[table]
            .filter(() => Math.random() > 0.65)
            .map(column => {
              const order = randomizeOrder();

              questionBluePrint.orderBy.push({
                column: column.columnName,
                direction: order
              });

              return `${aliasDictionary[table]}.${column.columnName} ${order}`;
            })
        ],
        []
      )
      .join(",");
    return orderBy.length ? " ORDER BY " + orderBy : "";
  };
  const randomizeOrder = () => (Math.random() > 0.5 ? "ASC " : "DESC ");

  // TODO: REWRITE QUERY IF RESULT IS EMPTY
  let result = [];
  let columnQuery, fromQuery, whereQuery, groupQuery, havingQuery, orderQuery;
  while (!result.length) {
    columnQuery = constructColumn(columns);
    fromQuery = constructFrom(tables, parsedDB.edges);
    whereQuery = await constructWhere(tables, parsedDB.tables, db);
    groupQuery = constructGroupBy(tables, parsedDB.tables);
    orderQuery = constructOrderBy(columns);

    const query =
      "SELECT " +
      columnQuery +
      fromQuery +
      whereQuery +
      groupQuery +
      orderQuery;

    try {
      result = await db.adapter.queryDB(db, query);
    } catch (e) {
      result = [];
    }
    if (!result.length) {
      questionBluePrint = {
        columns: [],
        tables: [],
        where: [],
        whereConcatenation: [],
        groupBy: [],
        orderBy: []
      };
    }
  }

  return {
    query: {
      selectQuery: "SELECT ",
      columnQuery,
      fromQuery,
      whereQuery,
      groupQuery,
      orderQuery
    },
    questionBluePrint
  };
};
