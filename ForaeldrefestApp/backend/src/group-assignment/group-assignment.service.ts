import { Injectable } from '@nestjs/common';

export class Person {
  constructor(
    public name: string,
    public isHostForCourse1: boolean,
    public isHostForCourse2: boolean,
    public isCoupleWith: Person | null = null,
    public address?: string,
  ) {
    if (isCoupleWith) {
      isCoupleWith.isCoupleWith = this;
      this.isCoupleWith = isCoupleWith;
    }
  }
}

export class Group {
  constructor(
    public address: string,
    public members: Person[],
    public course: number,
  ) {}

  includes(person: Person): boolean {
    return this.members.some((p) => p === person);
  }
}

@Injectable()
export class GroupAssignmentService {
  private people: Person[] = [];

  setPeople(people: Person[]) {
    this.people = people;
  }

  private shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private assignGroups(course: number) {
    const groups: Person[][] = [];
    let potentialHosts: Person[];
    if (course === 1) {
      potentialHosts = this.people.filter((person) => person.isHostForCourse1);
    } else {
      potentialHosts = this.people.filter((person) => person.isHostForCourse2);
    }

    const hosts: Person[] = potentialHosts.reduce((acc, curr) => {
      const previousHost = acc.find((host) => host.address === curr.address);
      if (previousHost) {
        const randomIndex = Math.floor(Math.random() * 2);
        if (randomIndex === 0) {
          acc.splice(acc.indexOf(previousHost), 1);
          acc.push(curr);
        }
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);

    for (const host of hosts) {
      groups.push([host]);
    }

    // Shuffle remaining guests and assign them to groups
    const guests = this.people.filter((person) => !hosts.includes(person));
    this.shuffle(guests);

    const numGroups = groups.length;
    const maxGuestsPerGroup = Math.floor(guests.length / numGroups);
    let remainingGuests = guests.length;

    for (let i = 0; i < numGroups; i++) {
      const group = groups[i];
      const numGuestsToAdd = Math.min(maxGuestsPerGroup, remainingGuests);
      for (let j = 0; j < numGuestsToAdd; j++) {
        group.push(guests.shift());
        remainingGuests--;
      }
    }

    let groupIndex = 0;
    while (guests.length > 0) {
      groups[groupIndex].push(guests.shift());
      groupIndex = (groupIndex + 1) % numGroups;
    }

    // Convert Person[][] to Group[]
    return groups.map((group) => new Group(group[0].address!, group, course));
  }

  private calculateSameGroupCount(
    course1Groups: Group[],
    course2Groups: Group[],
  ): number {
    let count = 0;

    for (const group1 of course1Groups) {
      for (const group2 of course2Groups) {
        for (const person1 of group1.members) {
          for (const person2 of group2.members) {
            if (person1 === person2) {
              count++;
            }
          }
        }
      }
    }

    return count;
  }

  private separateCouples(groups: Group[]) {
    const couples = this.people.filter((person) => person.isCoupleWith);

    for (const couplePerson of couples) {
      const coupleGroupIndex = groups.findIndex(
        (group) =>
          group.members.includes(couplePerson) &&
          group.members.some(
            (member) => member.isCoupleWith?.name === couplePerson.name,
          ),
      );
      if (coupleGroupIndex != -1) {
        const coupleGroup = groups[coupleGroupIndex];
        const couplePartner = couplePerson.isCoupleWith!;

        // Find a random group for the couple partner
        const otherGroups = groups.filter((group) => group !== coupleGroup);
        // Find the group with the fewest current members
        const fewestMembersGroup = otherGroups.reduce((minGroup, group) => {
          return group.members.length < minGroup.members.length
            ? group
            : minGroup;
        }, otherGroups[0]);

        // Remove the couple partner from the couple group and add to the random group
        console.log(
          `Moving ${couplePartner.name} from group ${coupleGroup.address} to group ${fewestMembersGroup.address}`,
        );
        coupleGroup.members.splice(
          coupleGroup.members.indexOf(couplePartner),
          1,
        );
        fewestMembersGroup.members.push(couplePartner);
        couples.splice(couples.indexOf(couplePerson));
        couples.splice(couples.indexOf(couplePartner));
      }
    }
  }

  getGroupAssignments() {
    const course1Groups = this.assignGroups(1);
    const course2Groups = this.assignGroups(2);
    this.separateCouples(course1Groups);
    this.separateCouples(course2Groups);
    // const sameGroupCount = this.calculateSameGroupCount(
    //   course1Groups,
    //   course2Groups,
    // );
    return {
      course1Groups,
      course2Groups,
      // sameGroupCount,
    };
  }
}
