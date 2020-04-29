function NetworkBuilder(netWorkJson){
    this.netWorkJson = netWorkJson
    this.build = build
}

function build(netWorkJson){
    let network = null
    if(netWorkJson){
        network = Network.fromJSON(netWorkJson);
    } else{
        network = new synaptic.Architect.Perceptron(4, 6, 1)
    }
    return network
}