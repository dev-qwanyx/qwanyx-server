import { useState } from 'react'
import { Button, Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter, SimpleModal, Container, Heading, Text, Grid } from '../components'

export const ModalTestPage = () => {
  const [isBasicOpen, setIsBasicOpen] = useState(false)
  const [isSmallOpen, setIsSmallOpen] = useState(false)
  const [isLargeOpen, setIsLargeOpen] = useState(false)
  const [isSimpleOpen, setIsSimpleOpen] = useState(false)
  const [isNoOverlayOpen, setIsNoOverlayOpen] = useState(false)

  return (
    <Container style={{ padding: '2rem' }}>
      <Heading as="h1" size="3xl" style={{ marginBottom: '2rem' }}>
        Modal Component Test
      </Heading>

      <Grid cols={2} gap="lg">
        <Button onClick={() => setIsBasicOpen(true)}>
          Open Basic Modal
        </Button>

        <Button onClick={() => setIsSmallOpen(true)} variant="outline">
          Open Small Modal
        </Button>

        <Button onClick={() => setIsLargeOpen(true)} variant="secondary">
          Open Large Modal
        </Button>

        <Button onClick={() => setIsSimpleOpen(true)} variant="ghost">
          Open Simple Modal
        </Button>

        <Button onClick={() => setIsNoOverlayOpen(true)} variant="outline">
          Open Modal (No Overlay Click)
        </Button>
      </Grid>

      {/* Basic Modal */}
      <Modal
        isOpen={isBasicOpen}
        onClose={() => setIsBasicOpen(false)}
        size="md"
      >
        <ModalHeader>
          <ModalTitle>Basic Modal</ModalTitle>
          <ModalDescription>
            This is a basic modal with header, body and footer.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <Text>
            Modal content goes here. You can put any content inside the modal body.
            This modal has a medium size and can be closed by clicking the overlay,
            pressing Escape, or clicking the close button.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsBasicOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsBasicOpen(false)}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>

      {/* Small Modal */}
      <Modal
        isOpen={isSmallOpen}
        onClose={() => setIsSmallOpen(false)}
        size="sm"
      >
        <ModalHeader>
          <ModalTitle>Small Modal</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Text>This is a small modal, perfect for simple confirmations.</Text>
        </ModalBody>
        <ModalFooter>
          <Button size="sm" onClick={() => setIsSmallOpen(false)}>
            OK
          </Button>
        </ModalFooter>
      </Modal>

      {/* Large Modal */}
      <Modal
        isOpen={isLargeOpen}
        onClose={() => setIsLargeOpen(false)}
        size="lg"
      >
        <ModalHeader>
          <ModalTitle>Large Modal</ModalTitle>
          <ModalDescription>
            This modal has more space for complex content
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <Text style={{ marginBottom: '1rem' }}>
            This is a large modal that can contain more complex content like forms,
            lists, or detailed information.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </Text>
        </ModalBody>
        <ModalFooter align="between">
          <Button variant="ghost" onClick={() => setIsLargeOpen(false)}>
            Cancel
          </Button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="outline" onClick={() => setIsLargeOpen(false)}>
              Save Draft
            </Button>
            <Button onClick={() => setIsLargeOpen(false)}>
              Publish
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Simple Modal */}
      <SimpleModal
        isOpen={isSimpleOpen}
        onClose={() => setIsSimpleOpen(false)}
        title="Simple Modal"
        description="This uses the SimpleModal component for quick setup"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsSimpleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsSimpleOpen(false)}>
              Confirm
            </Button>
          </>
        }
      >
        <Text>
          SimpleModal is a convenience component that wraps the Modal components
          for common use cases.
        </Text>
      </SimpleModal>

      {/* No Overlay Click Modal */}
      <Modal
        isOpen={isNoOverlayOpen}
        onClose={() => setIsNoOverlayOpen(false)}
        size="md"
        closeOnOverlayClick={false}
      >
        <ModalHeader>
          <ModalTitle>Important Action Required</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Text>
            This modal cannot be closed by clicking the overlay. 
            You must use the close button or the action buttons.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsNoOverlayOpen(false)}>
            Dismiss
          </Button>
          <Button onClick={() => setIsNoOverlayOpen(false)}>
            Take Action
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  )
}