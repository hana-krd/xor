export enum Roles{
    //a normal peron in system that can do some update on itself's profile
    ME,

    //who that created the charity in our system
    CHARITY_CREATOR,

    //current who owned charity
    CHARITY_OWNER,

    //who founded charity
    CHARITY_FOUNDER,

    //a person that donate to charities
    DONATOR,

    //a person that need some help
    NEEDEY,

    //manage user of organ(charity, site)
    MANAGE_USERS,

    //manage financials of organ
    ACCOUNTANT,

    //manage warehouse of charity
    WAREHOUSE_KEEPER,

    SUPPORT,
    
    ROOT
}