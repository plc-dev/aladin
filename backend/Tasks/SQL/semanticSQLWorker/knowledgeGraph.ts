export const knowledgeGraph = {
    Profession: {
        label: "profession",
        alias: [{ sing: "profession", plur: "professions" }],
    },
    Person: {
        label: "person",
        alias: [
            {
                sing: "person",
                plur: "persons",
            },
        ],
        edges: [
            {
                id: "Title",
                label: "workAs",
                type: "relation",
                target: "Title",
                properties: {
                    job: {},
                },
            },
            {
                id: "personId",
                label: "ID",
                type: "attribute",
                target: "",
                properties: {},
            },
        ],
    },
};

interface IAlias {
    sing: string;
    plur: string;
}

export interface IStructuredKnowledgeGraph {
    [key: string]: {
        [key: string]: {
            alias: Array<IAlias>;
            unit?: string;
        };
    };
    // minorEntities: {
    //     [key: string]: {
    //         alias: Array<IAlias>;
    //         unit?: string;
    //     };
    // };
    // majorAttributes: {
    //     [key: string]: {
    //         alias: Array<IAlias>;
    //         unit?: string;
    //     };
    // };
    // minorAttributes: {
    //     [key: string]: {
    //         alias: Array<IAlias>;
    //         unit?: string;
    //     };
    // };
    // semanticEdges: {
    //     [key: string]: {
    //         alias: Array<IAlias>;
    //         unit?: string;
    //     };
    // };
}

// majorEntities: Relations that only possess hasA- and semantic edges
// minorEntities: Relations that possess belongsTo-edges with cardinality n-m
// majorAttributes: Relations that possess belongsTo-edges with cardinality 1-m
// minorAttributes: Columns (naturally cardinality 1-1)
// semanticEdges: Junction-Relations with hasA-edges (naturally connecting tables with cardinality n-m)
export const structuredKnowledgeGraph: IStructuredKnowledgeGraph = {
    majorEntities: {
        Person: {
            alias: [{ sing: "person", plur: "persons" }],
        },
        Title: {
            alias: [{ sing: "movie", plur: "movies" }],
        },
    },
    minorEntities: {
        Profession: {
            alias: [{ sing: "profession", plur: "professions" }],
        },
        Genre: {
            alias: [{ sing: "genre", plur: "genres" }],
        },
        Types: { alias: [{ sing: "type", plur: "types" }] },
        Attributes: {
            alias: [{ sing: "attribute", plur: "attributes" }],
        },
    },
    majorAttributes: {
        Title_Localization: {
            alias: [{ sing: "localization", plur: "localizations" }],
        },
    },
    minorAttributes: {
        attributeId: {
            alias: [{ sing: "attribute-id", plur: "attribute-ids" }],
        },
        attribute: {
            alias: [{ sing: "title-attribute", plur: "title-attributes" }],
        },
        genre: {
            alias: [{ sing: "film genre", plur: "film genres" }],
        },
        genreId: {
            alias: [{ sing: "genre-id", plur: "genre-ids" }],
        },
        personId: {
            alias: [{ sing: "person-id", plur: "person-ids" }],
        },
        name: {
            alias: [{ sing: "name", plur: "names" }],
        },
        birthYear: {
            alias: [{ sing: "year of birth", plur: "year of birth" }],
        },
        deathYear: {
            alias: [{ sing: "year of death", plur: "year of death" }],
        },
        professionId: {
            alias: [{ sing: "profession-id", plur: "profession-ids" }],
        },
        profession: {
            alias: [{ sing: "profession", plur: "professions" }],
        },
        titleId: {
            alias: [{ sing: "title-id", plur: "title-ids" }],
        },
        format: {
            alias: [{ sing: "format", plur: "formats" }],
        },
        title: {
            alias: [{ sing: "movie title", plur: "movie titles" }],
        },
        isAdult: {
            alias: [{ sing: "wether or not the movie is rated adult", plur: "wether or not the movie is rated adult" }],
        },
        startYear: {
            alias: [{ sing: "release year", plur: "release years" }],
        },
        endYear: {
            alias: [{ sing: "cancelation year", plur: "cancelation years" }],
        },
        runtimeMinutes: {
            alias: [{ sing: "runtime", plur: "runtime" }],
            unit: "minutes",
        },
        averageRating: {
            alias: [{ sing: "average rating", plur: "average ratings" }],
        },
        numVotes: {
            alias: [{ sing: "number of votes", plur: "number of votes" }],
        },
        localizationId: {
            alias: [{ sing: "localization-id", plur: "localization-ids" }],
        },
        alternativeTitle: {
            alias: [{ sing: "localized title", plur: "localized titles" }],
        },
        region: {
            alias: [{ sing: "region", plur: "regions" }],
        },
        language: {
            alias: [{ sing: "localized title", plur: "localized titles" }],
        },
        isOriginalTitle: {
            alias: [{ sing: "wether or not the title is the original title", plur: "wether or not the title is the original title" }],
        },
        typeId: {
            alias: [{ sing: "type-id", plur: "type-ids" }],
        },
        type: {
            alias: [{ sing: "type", plur: "types" }],
        },
    },
    semanticEdges: {},
};
