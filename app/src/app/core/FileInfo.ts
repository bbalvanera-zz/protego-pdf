const path = window.require('path');

export class FileInfo {
  public readonly name: string;
  public readonly nameWithoutExtension: string;
  public readonly extension: string;
  public readonly directoryName: string;
  public readonly fullName: string;

  constructor(private fileName: string) {
    if (!fileName || fileName.trim().length === 0) {
      throw Error('Invalid argument');
    }

    this.extension = path.extname(fileName);
    this.nameWithoutExtension = path.basename(fileName, this.extension);
    this.name = path.basename(fileName);
    this.directoryName = path.dirname(fileName);
    this.fullName = fileName;
  }
}
