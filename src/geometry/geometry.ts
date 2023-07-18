export interface XYCoord
{
    x: number;
    y: number;
}

export interface GridCoord
{
    vLineCoord: number;
    hLineCoord: number;
}

export enum AngleQudrantClockwise
{
    First_0_90 = "First_0_90",
    Second_90_180 = "Second_90_180",
    Third_180_270 = "Third_180_270",
    Fourth_270_360 = "Fourth_270_360"
}
