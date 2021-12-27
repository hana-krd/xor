export enum Roles {
    //a normal peron in system that can do some update on itself's profile
    ME = "ME",

    //who that created the charity in our system
    CHARITY_CREATOR = "CHARITY_CREATOR",

    //current who owned charity
    CHARITY_OWNER = "CHARITY_OWNER",

    //who founded charity
    CHARITY_FOUNDER = "CHARITY_FOUNDER",

    //a person that donate to charities
    DONATOR = "DONATOR",

    //a person that need some help
    NEEDEY = "NEEDEY",

    //manage user of organ(charity, site)
    MANAGE_USERS = "MANAGE_USERS",

    //manage financials of organ
    ACCOUNTANT = "ACCOUNTANT",

    //manage warehouse of charity
    WAREHOUSE_KEEPER = "WAREHOUSE_KEEPER",

    SUPPORT = "SUPPORT",

    ROOT = "ROOT"
}