import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function FilterContainer(props) {
 
  return (
    <Card style={{ width: '200px', maxHeight: '400px', overflowY: 'auto', marginBottom: '20px'}}>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
             Filters
          </Accordion.Header>
          <Accordion.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="title"
                  value={props.filters.title}
                  onChange={props.handleFilterChange}
                  placeholder="Title"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="supervisor"
                  value={props.filters.supervisor}
                  onChange={props.handleFilterChange}
                  placeholder="Supervisor"
                />
              </Form.Group>
              <p><strong>Expiration Date</strong></p>
              <Form.Group className="mb-3">
                <Form.Control
                  type="date"
                  name="expDate"
                  value={props.filters.expDate}
                  onChange={props.handleFilterChange}
                />
              </Form.Group>
              <p><strong>Creation Date</strong></p>
              <Form.Group className="mb-3">
                <Form.Control
                  type="date"
                  name="creatDate"
                  value={props.filters.creatDate}
                  onChange={props.handleFilterChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  as="select"
                  name="status"
                  value={props.filters.status}
                  onChange={props.handleFilterChange}
                >
                  <option value="">Status</option>
                  <option value="1">Published</option>
                  <option value="0">Archivied</option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="keywords"
                  value={props.filters.keywords}
                  onChange={props.handleFilterChange}
                  placeholder="Keywords"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="type"
                  value={props.filters.type}
                  onChange={props.handleFilterChange}
                  placeholder="Type"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="groups"
                  value={props.filters.groups}
                  onChange={props.handleFilterChange}
                  placeholder="Groups"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  as="select"
                  name="level"
                  value={props.filters.level}
                  onChange={props.handleFilterChange}
                >
                  <option value="">Level</option>
                  <option value="1">Master</option>
                  <option value="0">Bachelor</option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="cds"
                  value={props.filters.cds}
                  onChange={props.handleFilterChange}
                  placeholder="CdS"
                />
              </Form.Group>
              {/* Add other filter input fields here */}
              <Button variant="primary" onClick={props.handleApplyFilters}>
                Apply Filters
              </Button>
              <Button variant="danger" onClick={props.handleResetChange} style={{marginTop:'5px'}}>
                Reset Filters
              </Button>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
}

export { FilterContainer };