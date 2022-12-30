// this file is auto-generated, please see schema-generator.ts. To regenerate, run yarn generate-schema
export const schema = [
    {
        type: "object",
        properties: {
            startTime: {
                description: "seconds since midnight.",
                type: "number",
            },
            endTime: {
                description: "seconds since midnight.",
                type: "number",
            },
            days: {
                type: "array",
                items: {
                    $ref: "Weekday",
                },
            },
            locations: {
                description:
                    "Location is an array because some classes have multiple locations.\nThis is especially common for lab classes.",
                type: "array",
                items: {
                    type: "string",
                },
            },
        },
        required: ["days", "endTime", "locations", "startTime"],
        $id: "Schedule",
    },
    {
        description:
            "CourseIdentifier is the unique identifier we need to pinpoint a course offering\nfrom the database. We may stringify it as something like\n`TEST001 SC-05 2022/FA`.",
        type: "object",
        properties: {
            sectionNumber: {
                type: "number",
            },
            year: {
                type: "number",
            },
            term: {
                $ref: "Term",
            },
            half: {
                type: "string",
            },
            department: {
                description:
                    "2-4 letters code in all upper case, e.g. CSCI, PE, HSA",
                type: "string",
            },
            courseNumber: {
                type: "number",
            },
            suffix: {
                type: "string",
            },
            affiliation: {
                type: "string",
            },
        },
        required: [
            "affiliation",
            "courseNumber",
            "department",
            "half",
            "sectionNumber",
            "suffix",
            "term",
            "year",
        ],
        $id: "SectionIdentifier",
    },
    {
        description:
            "For course start and end dates, used to identify half-semester types.",
        type: "object",
        properties: {
            year: {
                type: "number",
            },
            month: {
                type: "number",
            },
            day: {
                type: "number",
            },
        },
        required: ["day", "month", "year"],
        $id: "CourseDate",
    },
    {
        description:
            "CourseCode is what we can use to identify equivalent course offerings in\ndifferent semesters. As such, there is no year or semester attached to it.",
        type: "object",
        properties: {
            department: {
                description:
                    "2-4 letters code in all upper case, e.g. CSCI, PE, HSA",
                type: "string",
            },
            courseNumber: {
                type: "number",
            },
            suffix: {
                type: "string",
            },
            affiliation: {
                type: "string",
            },
        },
        required: ["affiliation", "courseNumber", "department", "suffix"],
        $id: "CourseCode",
    },
    {
        description:
            "All school codes are three letters for consistency. According to portal\nthere is no course taught at KGI",
        enum: ["CG", "CM", "HM", "PO", "PZ", "SC"],
        type: "string",
        $id: "School",
    },
    {
        enum: ["FA", "SP", "SU"],
        type: "string",
        $id: "Term",
    },
    {
        enum: ["F", "M", "R", "S", "T", "U", "W"],
        type: "string",
        $id: "Weekday",
    },
    {
        enum: ["C", "O", "R", "U"],
        type: "string",
        $id: "SectionStatus",
    },
    {
        type: "object",
        properties: {
            code: {
                $ref: "CourseCode",
            },
            title: {
                type: "string",
            },
            description: {
                type: "string",
            },
            primaryAssociation: {
                $ref: "School",
            },
            potentialError: {
                type: "boolean",
            },
        },
        required: [
            "code",
            "description",
            "potentialError",
            "primaryAssociation",
            "title",
        ],
        $id: "Course",
    },
    {
        type: "object",
        properties: {
            name: {
                type: "string",
            },
        },
        required: ["name"],
        $id: "Instructor",
    },
    {
        type: "object",
        properties: {
            identifier: {
                $ref: "SectionIdentifier",
            },
            courseAreas: {
                type: "array",
                items: {
                    type: "string",
                },
            },
            credits: {
                type: "number",
            },
            permCount: {
                type: "number",
            },
            seatsTotal: {
                type: "number",
            },
            seatsFilled: {
                type: "number",
            },
            status: {
                $ref: "SectionStatus",
            },
            startDate: {
                $ref: "CourseDate",
            },
            endDate: {
                $ref: "CourseDate",
            },
            instructors: {
                type: "array",
                items: {
                    $ref: "Instructor",
                },
            },
            course: {
                $ref: "Course",
            },
            schedules: {
                type: "array",
                items: {
                    $ref: "Schedule",
                },
            },
            potentialError: {
                type: "boolean",
            },
        },
        required: [
            "course",
            "courseAreas",
            "credits",
            "endDate",
            "identifier",
            "instructors",
            "permCount",
            "potentialError",
            "schedules",
            "seatsFilled",
            "seatsTotal",
            "startDate",
            "status",
        ],
        $id: "Section",
    },
];
