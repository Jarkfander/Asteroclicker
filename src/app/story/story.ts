export interface IStoryState {
    id: number;
    description: string;
}

export const story: string[] = [
    'Hello, Captain ! This is your ship.',              // 0
    'Recovers the different pieces of asteroid that your drone already mined.',  // 1
    'This panel shows you the various information about your asteroid as like the life of this one, click on the asteroid to see what happens !',           // 2
    'Good job, your HQ deserves to be improved Captain ! It unlocks the general level of your ship.',                 // 3
    'The life of your asteroid is soon over, you can start searching for new asteroids. If you finished one you get a chest.',           // 4
    'If you decide to travel to your next asteroid, you lose your current asteroid.',                    // 5
    '', // 6
    'Here are the credits they will be used to buy resources or to improve your ship.',       // 7
    'The market is used to buy or sell resources, the curve moves that means other commanders are selling their resources right now !', // 8
    'Here are the different improvements each cost resources or credits...', // 9
    'The engines are used to speed up the travel time, it also allows you to increase your click.', // 10
    'Research is used to reduce the search time to find an asteroid but also to unblock other materials.', // 11
    'The mining upgrade is used to improve the mining of drones', // 12
    'The storage upgrade is used to increases storage capacity and increases the maximum amount that can be sold or purchased', // 13
    '' //
];
