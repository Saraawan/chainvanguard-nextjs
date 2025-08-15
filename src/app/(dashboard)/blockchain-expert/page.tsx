'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  Network, 
  Monitor, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Server,
  Database,
  Activity,
  Eye,
  RefreshCw,
  Settings
} from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { BlockchainTransaction, ConsensusNode, NetworkHealth } from '@/types'
import { toast } from 'sonner'

export default function BlockchainExpertDashboard() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([])
  const [nodes, setNodes] = useState<ConsensusNode[]>([])
  const [networkHealth, setNetworkHealth] = useState<NetworkHealth | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Mock data - replace with real blockchain API calls later
      const mockTransactions: BlockchainTransaction[] = [
        {
          id: '1',
          hash: '0x1234567890abcdef1234567890abcdef12345678',
          from: '0xabc123def456789abc123def456789abc123def4',
          to: '0xdef456789abc123def456789abc123def456789a',
          value: '25.99',
          gasUsed: '21000',
          gasPrice: '20',
          blockNumber: 12345678,
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          type: 'product-creation',
          status: 'confirmed',
          metadata: {
            productId: 'prod_001',
            productName: 'Organic Coffee Beans'
          }
        },
        {
          id: '2',
          hash: '0x2345678901bcdef02345678901bcdef023456789',
          from: '0xbcd234ef567890bcd234ef567890bcd234ef56',
          to: '0xef567890bcd234ef567890bcd234ef567890bc',
          value: '199.99',
          gasUsed: '45000',
          gasPrice: '22',
          blockNumber: 12345679,
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          type: 'payment',
          status: 'confirmed',
          metadata: {
            orderId: 'order_001',
            paymentMethod: 'crypto'
          }
        },
        {
          id: '3',
          hash: '0x3456789012cdef13456789012cdef1345678901',
          from: '0xcde345f678901cde345f678901cde345f678901',
          to: '0xf678901cde345f678901cde345f678901cde345',
          value: '0',
          gasUsed: '65000',
          gasPrice: '18',
          blockNumber: 12345680,
          timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
          type: 'consensus',
          status: 'pending',
          metadata: {
            consensusType: 'block_validation'
          }
        }
      ]

      const mockNodes: ConsensusNode[] = [
        {
          id: 'peer0.org1.example.com',
          name: 'Peer 0 - Organization 1',
          type: 'peer',
          status: 'online',
          lastSeen: new Date(Date.now() - 30 * 1000).toISOString(),
          blockHeight: 12345680,
          version: '2.4.1'
        },
        {
          id: 'peer1.org1.example.com',
          name: 'Peer 1 - Organization 1',
          type: 'peer',
          status: 'online',
          lastSeen: new Date(Date.now() - 45 * 1000).toISOString(),
          blockHeight: 12345680,
          version: '2.4.1'
        },
        {
          id: 'orderer.example.com',
          name: 'Orderer Node',
          type: 'orderer',
          status: 'online',
          lastSeen: new Date(Date.now() - 15 * 1000).toISOString(),
          blockHeight: 12345680,
          version: '2.4.1'
        },
        {
          id: 'ca.org1.example.com',
          name: 'Certificate Authority',
          type: 'ca',
          status: 'online',
          lastSeen: new Date(Date.now() - 60 * 1000).toISOString(),
          blockHeight: 0,
          version: '1.5.2'
        },
        {
          id: 'peer0.org2.example.com',
          name: 'Peer 0 - Organization 2',
          type: 'peer',
          status: 'syncing',
          lastSeen: new Date(Date.now() - 120 * 1000).toISOString(),
          blockHeight: 12345675,
          version: '2.4.0'
        }
      ]

      const mockNetworkHealth: NetworkHealth = {
        totalNodes: mockNodes.length,
        onlineNodes: mockNodes.filter(n => n.status === 'online').length,
        offlineNodes: mockNodes.filter(n => n.status === 'offline').length,
        syncingNodes: mockNodes.filter(n => n.status === 'syncing').length,
        averageBlockTime: 2.3,
        transactionThroughput: 1247,
        networkLatency: 45.2
      }

      setTransactions(mockTransactions)
      setNodes(mockNodes)
      setNetworkHealth(mockNetworkHealth)
    } catch (error) {
      toast.error('Failed to load blockchain data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefreshData = () => {
    toast.success('Refreshing blockchain data...')
    loadDashboardData()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800'
      case 'offline': return 'bg-red-100 text-red-800'
      case 'syncing': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'offline':
      case 'failed': return <XCircle className="h-4 w-4" />
      case 'syncing':
      case 'pending': return <Clock className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case 'peer': return <Server className="h-5 w-5" />
      case 'orderer': return <Network className="h-5 w-5" />
      case 'ca': return <Shield className="h-5 w-5" />
      default: return <Database className="h-5 w-5" />
    }
  }

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'product-creation': return 'bg-blue-100 text-blue-800'
      case 'product-transfer': return 'bg-purple-100 text-purple-800'
      case 'payment': return 'bg-green-100 text-green-800'
      case 'consensus': return 'bg-orange-100 text-orange-800'
      case 'audit': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Blockchain Expert Dashboard</h1>
          <p className="text-muted-foreground">Network monitoring and administration - {user?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefreshData} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Network Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Nodes</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkHealth?.totalNodes || 0}</div>
            <p className="text-xs text-muted-foreground">
              {networkHealth?.onlineNodes || 0} online, {networkHealth?.syncingNodes || 0} syncing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Block Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkHealth?.averageBlockTime || 0}s</div>
            <p className="text-xs text-muted-foreground">
              Average block time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Throughput</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkHealth?.transactionThroughput || 0}</div>
            <p className="text-xs text-muted-foreground">
              Transactions per hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Latency</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkHealth?.networkLatency || 0}ms</div>
            <p className="text-xs text-muted-foreground">
              Average latency
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="monitoring" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monitoring">Network Monitor</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="consensus">Consensus</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Nodes Status</CardTitle>
              <CardDescription>
                Monitor the status and health of all network nodes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nodes.map((node) => (
                  <div key={node.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-muted rounded-lg">
                        {getNodeTypeIcon(node.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{node.name}</h3>
                        <p className="text-sm text-muted-foreground">{node.id}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="capitalize">{node.type}</Badge>
                          <Badge className={getStatusColor(node.status)}>
                            {getStatusIcon(node.status)}
                            <span className="ml-1">{node.status}</span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium">Block: {node.blockHeight.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Version: {node.version}</p>
                      <p className="text-xs text-muted-foreground">
                        Last seen: {new Date(node.lastSeen).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Network Health</CardTitle>
                <CardDescription>Overall network performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Online Nodes</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ 
                            width: `${(networkHealth?.onlineNodes || 0) / (networkHealth?.totalNodes || 1) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {networkHealth?.onlineNodes}/{networkHealth?.totalNodes}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Network Latency</span>
                    <span className="text-sm font-medium">{networkHealth?.networkLatency}ms</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Block Time</span>
                    <span className="text-sm font-medium">{networkHealth?.averageBlockTime}s</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Recent system alerts and warnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Node Syncing</p>
                      <p className="text-xs text-muted-foreground">
                        peer0.org2.example.com is behind by 5 blocks
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Consensus Reached</p>
                      <p className="text-xs text-muted-foreground">
                        Block 12345680 confirmed by all peers
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Monitor all blockchain transactions in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}
                        </code>
                        <Badge className={getTransactionTypeColor(tx.type)}>
                          {tx.type}
                        </Badge>
                        <Badge className={getStatusColor(tx.status)}>
                          {getStatusIcon(tx.status)}
                          <span className="ml-1">{tx.status}</span>
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Block: {tx.blockNumber.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">From: </span>
                        <code className="text-xs">{tx.from.slice(0, 10)}...{tx.from.slice(-6)}</code>
                      </div>
                      <div>
                        <span className="text-muted-foreground">To: </span>
                        <code className="text-xs">{tx.to.slice(0, 10)}...{tx.to.slice(-6)}</code>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Value: </span>
                        <span className="font-medium">{tx.value} ETH</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Gas: </span>
                        <span>{tx.gasUsed} / {tx.gasPrice} gwei</span>
                      </div>
                    </div>

                    {tx.metadata && Object.keys(tx.metadata).length > 0 && (
                      <div className="mt-3 p-2 bg-muted rounded text-xs">
                        <strong>Metadata:</strong> {JSON.stringify(tx.metadata, null, 2)}
                      </div>
                    )}

                    <div className="flex justify-end mt-3">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consensus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consensus Management</CardTitle>
              <CardDescription>
                Monitor and manage the consensus mechanism
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Network className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Consensus Protocol</h3>
                <p className="text-muted-foreground mb-4">
                  Advanced consensus management tools coming soon
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto">
                  <Button variant="outline" disabled>
                    Configure Policies
                  </Button>
                  <Button variant="outline" disabled>
                    Validate Blocks
                  </Button>
                  <Button variant="outline" disabled>
                    Network Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Management</CardTitle>
              <CardDescription>
                Network security monitoring and configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Security Center</h3>
                <p className="text-muted-foreground mb-4">
                  Advanced security monitoring and management tools coming soon
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto">
                  <Button variant="outline" disabled>
                    Access Control
                  </Button>
                  <Button variant="outline" disabled>
                    Audit Logs
                  </Button>
                  <Button variant="outline" disabled>
                    Key Management
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}