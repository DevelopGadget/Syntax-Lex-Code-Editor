export interface TreeWords {
  name: string;
  id: number;
  children?: TreeWords[]
}

export interface TreeWordsFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
