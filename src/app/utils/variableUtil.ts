export class VariableUtil {

  private static _instance: VariableUtil;

  public static Instance(createSpan: Function): VariableUtil
  {
      return this._instance || (this._instance = new this(createSpan));
  }

  createSpan: Function;

  constructor(createSpan: Function){
    this.createSpan = createSpan;
  }

  validateVariable(line: string, index: number) {
    var errors = '';

    var reg: RegExp = new RegExp(/(\s*declare\s*)([a-zA-Z][_0-9a-zA-Z]{0,15}\s*(\s*,\s*[a-zA-Z][_0-9a-zA-Z]{0,15})*)\s*(entero|cadena|logico|fecha|real)\s*;\s*/gsi);

    line = line.replace(/(\s+)?,(\s+)?/g, ',');

    const splited = line.toString().split(' ').filter(tes => tes.trim() !== '');
    if (!reg.test(line)) {

      this.createSpan('color-omited', 'Compilando linea ' + (index + 1));

      if (!/\s*;\s*$/.test(line)) errors += 'Error falta ";"\n';

      if (/^(?:(?!(entero|cadena|logico|fecha|real)).)*$/.test(line)) errors += 'Error no contiene un tipo de dato no valido\n';

      const error = this.validateAllVariable(splited);
      if (error) errors += error;

    } else {
      const error = this.validateAllVariable(splited);
      if (error) errors += error;
    }

    if (errors) {
      this.createSpan('color-red', errors);
    } else {
      this.createSpan('color-blue', 'Compilación exitosa de la linea ' + (index + 1));
    }

  }

  validateAllVariable(splited: string[]): string {
    if (splited[1].toString().trim().includes(',')) {
      const error = this.validateMultiVariable(splited[1]);
      return error;
    } else {
      const opts = this.validateOptionsVariable(splited[1]);
      return opts;
    }
  }

  validateOptionsVariable(variable: string): string {
    if (/^(?:(?!([a-zA-Z]))(.*))*$/.test(variable)) return 'Error nombre de variable no inicia con una letra "' + variable + '"\n';
    else if (/(?:(?!(\w+)).+)$/.test(variable)) return 'Error nombre de variable no debe contener caracteres especiales "' + variable + '"\n';
    else if (/(declare|entero|cadena|logico|fecha|real|entonces|mq|finmq|para|finpara|haga|recibe|si|finsi|sino|function|Inicio|Fin|envia|recibe|llamar)$/.test(variable)) return 'Error nombre de variable no debe contener palabras reservadas "' + variable + '"\n';
    else if (!variable || variable.length <= 0 || variable.length > 16) return 'Error nombre de variable tiene que ser mínimo 1 y máximo 16 "' + variable + '"\n';
    else return null;
  }

  validateMultiVariable(variables: string): string {
    console.log(variables);
    const splitedVar = variables.toString().trim().split(',');
    var errors: string = '';
    splitedVar.forEach(item => {
      const opts = this.validateOptionsVariable(item);
      if (opts) errors += opts;
    });

    return errors;
  }

}
