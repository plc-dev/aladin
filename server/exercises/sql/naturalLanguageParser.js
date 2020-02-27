const { templateString, replaceAt } = require("../../helper");

module.exports = (blueprint, db) => {
  let question = "";

  const operatorDictionary = db.adapter.textualRepresentation;

  const replaceLastComma = question => {
    const lastComma = question.lastIndexOf(",");
    if (~lastComma) {
      question = replaceAt(question, " und", lastComma, 1);
    }
    return question;
  };

  if (blueprint.columns.length > 1) {
    question += "Gib die Spalten: ";
    const columns = blueprint.columns.map(column => {
      if (column.aggregate) {
        return templateString(operatorDictionary[column.aggregate], {
          column: column.column
        });
      } else {
        return column.column;
      }
    });
    question += columns.join(", ");
  } else {
    const column = blueprint.columns[0];
    question += "Gib die Spalte: ";
    if (column.aggregate) {
      question += templateString(operatorDictionary[column.aggregate], {
        column: column.column
      });
    } else {
      question += column.column;
    }
  }
  question = replaceLastComma(question);
  question += " aus";

  if (blueprint.where.length) {
    question += ", wobei ";
    const where = blueprint.where.map(constraint => {
      if (constraint.operator === "BETWEEN") {
        return (
          `${constraint.column} ` +
          templateString(operatorDictionary["BETWEEN"], {
            value1: constraint.value1,
            value2: constraint.value2
          })
        );
      } else if (
        constraint.operator === "LIKE" ||
        constraint.operator === "NOT LIKE"
      ) {
        let op;
        if (/\w+%/.test(constraint.value) && !/%\w+/.test(constraint.value)) {
          op = operatorDictionary[constraint.operator][1];
          constraint.value = constraint.value.replace(/%/g, "");
        } else if (
          /%\w+/.test(constraint.value) & !/\w+%/.test(constraint.value)
        ) {
          op = operatorDictionary[constraint.operator][2];
          constraint.value = constraint.value.replace(/%/g, "");
        } else {
          op = operatorDictionary[constraint.operator][0];
          constraint.value = constraint.value.replace(/%/g, "");
          if (constraint.value === "") {
            constraint.value = "eine beliebige Zeichenkette";
          }
        }
        return (
          `${constraint.column} ` +
          templateString(op, {
            value: constraint.value
          })
        );
      } else if (constraint.value === null) {
        const isNull = /NOT/.test(constraint.operator) ? "nicht NULL" : "NULL";
        return `${constraint.column} ${isNull} ist`;
      } else {
        return `${constraint.column} ${
          operatorDictionary[constraint.operator]
        } ${constraint.value} ist`;
      }
    });
    question += where.reduce((where, constraint, index) => {
      const concatOperator = blueprint.whereConcatenation[index];
      const concat =
        concatOperator === " OR "
          ? " oder "
          : concatOperator === " AND "
          ? " und "
          : "";
      return (where += constraint + concat);
    }, "");
  }

  if (blueprint.groupBy.length) {
    question += ` und gruppiere das Ergebnis nach ${blueprint.groupBy.join(
      ", "
    )}`;
  }

  if (blueprint.orderBy.length) {
    const order = blueprint.orderBy.map(
      column =>
        `${column.direction === "ASC" ? "aufsteigend" : "absteigend"} nach ${
          column.column
        }`
    );
    question += ` und sortiere das Ergebnis ${order.join(", ")}`;
  }

  question += ".";

  if (blueprint.tables[0].hasOwnProperty("joining")) {
    const join = blueprint.tables[0];
    if (join.type === "LEFT OUTER JOIN") {
      question += ` Bilde die Schnittmenge die alle Einträge von ${join.table} und korrespondierende Einträge von ${join.joining} enthält.`;
    } else if (join.type === "CROSS JOIN") {
      question += ` Bilde das kartesische Produkt der Tabellen ${join.table} und ${join.joining}.`;
    } else {
      question += ` Bilde die Schnittmenge die korrespondierende Einträge der beiden Tabellen ${join.table} und ${join.joining} enthält.`;
    }
  }

  return question;
};
