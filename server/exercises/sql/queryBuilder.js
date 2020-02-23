const { getRandomInt, templateString } = require("../../helper");

module.exports = async (db, options) => {
  const reflectDB =
    "SELECT sql FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';";

  const rawDB = await db.adapter.queryDB(db, reflectDB);
  const parsedDB = await require("./parser/sqlParser")({
    sourceCode: rawDB,
    sourceFlavour: "json",
    db
  });

  options = options || {
    join: true,
    joinAmount: 1,
    tables: [],
    columns: {},
    where: {},
    having: {},
    groupBy: {},
    orderBy: {}
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

  console.log(
    "LAAAAAST:   SELECT " + (await constructQuery(options, parsedDB, db))
  );

  return options;
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

// Querybuilder
const constructQuery = async (
  { tables, columns, where, having, groupBy, orderBy },
  parsedDB,
  db
) => {
  const constructColumn = columns =>
    Object.keys(columns)
      .reduce(
        (strings, table) => [
          ...strings,
          ...columns[table].map(column =>
            // TODO INTEGRATE INTO ADAPTER TO AGNOSTICALLY FIND VALID AGGREGATE TYPES
            Math.random() > 0.7 &&
            ["INT", "INTEGER", "REAL"].includes(column.type)
              ? constructAggregateColumn(table, column)
              : `${table}.${column.columnName}`
          )
        ],
        []
      )
      .join(", ");

  const constructAggregateColumn = (table, column) => {
    // TODO INTEGRATE INTO ADAPTER TO AGNOSTICALLY FIND VALID AGGREGATE VARIANTS
    const aggregateTypes = ["MAX", "MIN", "AVG", "COUNT", "SUM"];
    const aggregateFunction =
      aggregateTypes[getRandomInt(0, aggregateTypes.length - 1)];
    return `${aggregateFunction}(${table}.${column.columnName})`;
  };

  const constructFrom = (tables, edges) => {
    let fromStatement = ` FROM ${tables[0]}`;
    if (tables.length > 1) {
      fromStatement += constructJoin(edges);
    }
    return fromStatement;
  };

  const constructJoin = edges => {
    const selectedEdges = edges.filter(edge =>
      edge.every((table, index) => tables[index] === table.table)
    );
    return selectedEdges.reduce(
      (joinStatement, edge, index, edges) =>
        (joinStatement +=
          ` JOIN ${edge[1].table}` +
          ` ON ${edge[0].table}.${edge[0].column.join(", ")}` +
          ` = ${edge[1].table}.${edge[1].column.join(", ")} `),
      ""
    );
  };

  const constructWhere = async (selectedTables, tables, db) => {
    const columns = selectedTables.reduce((columns, table) => {
      columns[table] = getColumns(table, tables).filter(
        () => Math.random() > 0.1
      );
      if (!columns[table].length) delete columns.table;
      return columns;
    }, {});

    if (!Object.keys(columns).length) return "";

    const getRange = async (db, column) => {
      const query = Object.keys(column).reduce(
        (query, table) =>
          `SELECT MIN(${column[table].columnName}), MAX(${column[table].columnName}) FROM ${table}`,
        ""
      );
      return db.adapter.queryDB(db, query);
    };
    const getList = async () => {};

    const test = await Object.keys(columns).reduce(
      async (constraint, table) => {
        await columns[table].forEach(async column => {
          // TODO INCLUDE INTO ADAPTER TO MAKE IT AGNOSTIC
          if (["INT", "INTEGER", "NUMBERIC", "REAL"].includes(column.type)) {
            console.log(await getRange(db, { [table]: column }));
          }
          if (["TEXT"].includes(column.type)) {
          }
          console.log("test");
        });
        // await getRange();
        // await getList();
      }
    );

    return test;
  };

  const constructGroupBy = () => {};

  const constructHaving = () => {};

  const constructSubQuery = () => {};

  const constructOrderBy = columns => {
    const orderBy = Object.keys(columns)
      .reduce(
        (orderBy, table) => [
          ...orderBy,
          ...columns[table]
            .filter(() => Math.random() > 0.9)
            .map(column => `${table}.${column.columnName} ${randomizeOrder()}`)
        ],
        []
      )
      .join(",");
    return orderBy.length ? " ORDER BY " + orderBy : "";
  };

  const randomizeOrder = () => (Math.random() > 0.5 ? "ASC " : "DESC ");

  const query =
    constructColumn(columns) +
    constructFrom(tables, parsedDB.edges) +
    (await constructWhere(tables, parsedDB.tables, db)) +
    constructOrderBy(columns);
  return query;
};
